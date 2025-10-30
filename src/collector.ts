import { writeFileSync } from 'fs';
import sampleSize from 'lodash.samplesize';
import os from 'os';
import { join } from 'path';
import puppeteer, { Browser, Page, PuppeteerLifeCycleEvent, KnownDevices, PuppeteerLaunchOptions } from 'puppeteer';
import { captureNetwork } from '@themarkup/puppeteer-har';
import { getDomain, getSubdomain, parse } from 'tldts';
import { captureBrowserCookies, clearCookiesCache, setupHttpCookieCapture } from './inspectors/cookies';
import { getLogger } from './helpers/logger';
import { generateReport } from './parser';
import { defaultPuppeteerBrowserOptions, savePageContent } from './pptr-utils/default';
import { dedupLinks, getLinks, getSocialLinks } from './pptr-utils/get-links';
import { autoScroll, fillForms } from './pptr-utils/interaction-utils';
import { setupBlacklightInspector } from './inspectors/inspector';
import { setupKeyLoggingInspector } from './inspectors/key-logging';
import { setupSessionRecordingInspector } from './inspectors/session-recording';
import { setUpThirdPartyTrackersInspector } from './inspectors/third-party-trackers';
import { clearDir, closeBrowser } from './helpers/utils';

export type CollectorOptions = Partial<typeof DEFAULT_OPTIONS> & {location?: string};

const DEFAULT_OPTIONS = {
    outDir: join(process.cwd(), 'bl-tmp'),
    title: 'Blacklight Inspection',
    emulateDevice: KnownDevices['iPhone 13 Mini'],
    captureHar: true,
    captureLinks: false,
    enableAdBlock: false,
    clearCache: true,
    quiet: true,
    headless: true,
    defaultTimeout: 35000,
    numPages: 3,
    defaultWaitUntil: 'networkidle2' as PuppeteerLifeCycleEvent,
    saveBrowserProfile: false,
    saveScreenshots: true,
    headers: {},
    blTests: [
        'behaviour_event_listeners',
        'canvas_fingerprinters',
        'canvas_font_fingerprinters',
        'cookies',
        'fb_pixel_events',
        'tiktok_pixel_events',
        'twitter_pixel_events',
        'google_analytics_events',
        'key_logging',
        'session_recorders',
        'third_party_trackers'

    ],
    puppeteerExecutablePath: null as string | null,
    extraChromiumArgs: ['--disable-features=TrackingProtection3pcd'] as string[],
    extraPuppeteerOptions: {} as Partial<PuppeteerLaunchOptions>
};

export const collect = async (inUrl: string, args: CollectorOptions) => {
    args = { ...DEFAULT_OPTIONS, ...args }; // override defaults with user args
    clearDir(args.outDir);
    const FIRST_PARTY = parse(inUrl);
    let REDIRECTED_FIRST_PARTY = parse(inUrl);
    const logger = getLogger({ outDir: args.outDir, quiet: args.quiet });

    const output: any = {
        title: args.title,
        page_title: '',
        uri_ins: inUrl,
        uri_dest: null,
        uri_redirects: null,
        secure_connection: {},
        host: new URL(inUrl).hostname,
        config: {
            emulateDevice: args.emulateDevice,
            cleareCache: args.clearCache,
            captureHar: args.captureHar,
            captureLinks: args.captureLinks,
            enableAdBlock: args.enableAdBlock,
            saveBrowserProfile: args.saveBrowserProfile,
            numPages: args.numPages,
            defaultTimeout: args.defaultTimeout,
            defaultWaitUntil: args.defaultWaitUntil,
            headless: args.headless,
            headers: args.headers,
            extraChromiumArgs: args.extraChromiumArgs,
            extraPuppeteerOptions: args.extraPuppeteerOptions,
        },
        browser: null,
        script: {
            host: os.hostname(),
            version: {
                npm: require('../package.json').version,
                commit: require('../.commit-hash.cjs')
            },
            node_version: process.version
        },
        start_time: new Date(),
        end_time: null
    };
    if (args.location) output.location = args.location;

    // Log network requests and page links
    const hosts = {
        requests: {
            first_party: new Set(),
            third_party: new Set()
        },
        links: {
            first_party: new Set(),
            third_party: new Set()
        }
    };

    // set up browser and page
    let browser: Browser;
    let page: Page;
    let pageIndex = 1;
    let har = {} as any;
    const harOutputPath = args.outDir ? join(args.outDir, 'requests.har') : undefined;
    let page_response = null;
    const userDataDir = args.saveBrowserProfile ? join(args.outDir, 'browser-profile') : undefined;
    let didBrowserDisconnect = false;

    const options = {
        ...defaultPuppeteerBrowserOptions,
        args: [...defaultPuppeteerBrowserOptions.args, ...args.extraChromiumArgs],
        headless: args.headless,
        userDataDir
    };
    if (args.puppeteerExecutablePath) {
        options['executablePath'] = args.puppeteerExecutablePath;
    }
    try {
        browser = await puppeteer.launch(options); // launch browser
        browser.on('disconnected', () => {
            didBrowserDisconnect = true;
        });

        if (didBrowserDisconnect) {
            return {
                status: 'failed',
                page_response: 'Chrome crashed'
            };
        }
        logger.info(`Started Puppeteer with pid ${browser.process().pid}`);
        page = (await browser.pages())[0];
        output.browser = {
            name: 'Chromium',
            version: await browser.version(),
            user_agent: await browser.userAgent(),
            platform: {
                name: os.type(),
                version: os.release()
            }
        };
        page.emulate(args.emulateDevice);
        if (Object.keys(args.headers).length > 0) {
            page.setExtraHTTPHeaders(args.headers);
        }

        // record all requested hosts (the nework request send from the page)
        // distinguish between first and third party requests
        page.on('request', request => {
            const l = parse(request.url());
            // note that hosts may appear as first and third party depending on the path
            if (FIRST_PARTY.domain === l.domain) {
                hosts.requests.first_party.add(l.hostname);
            } else {
                if (request.url().indexOf('data://') < 1 && !!l.hostname) {
                    hosts.requests.third_party.add(l.hostname);
                }
            }
        });

        //clear cache
        if (args.clearCache) {
            await clearCookiesCache(page);
        }

        // Init blacklight instruments on page
        await setupBlacklightInspector(page, logger.warn); // set up debug / event logger(what logger does)
        await setupKeyLoggingInspector(page, logger.warn); // store get/post request data, look for whehther any keylogging(default value) is happening
        await setupHttpCookieCapture(page, logger.warn); // get cookie information in the response header
        await setupSessionRecordingInspector(page, logger.warn); // look for known session recording service provider url in the request url
        await setUpThirdPartyTrackersInspector(page, logger.warn, args.enableAdBlock); // look for known third party tracker url in the request url ??

        if (args.captureHar) {
            har = await captureNetwork(page);
        }
        if (didBrowserDisconnect) {
            return {
                status: 'failed',
                page_response: 'Chrome crashed'
            };
        }

        // Function to navigate to a page with a timeout guard
        const navigateWithTimeout = async (page: Page, url: string, timeout: number, waitUntil: PuppeteerLifeCycleEvent) => {
            try {
                page_response = await Promise.race([// this return a response object
                    page.goto(url, {
                        timeout: timeout, // condtion last for timeout ms
                        waitUntil: waitUntil // waiting for this condtion to occur max waitUntil ms
                    }),
                    new Promise((_, reject) =>
                        setTimeout(() => {
                            console.log('First navigation attempt timeout');
                            reject(new Error('First navigation attempt timeout'));
                        }, 10000)
                    )
                ]);
            } catch (error) {
                console.log('First attempt failed, trying with domcontentloaded');
                page_response = await page.goto(url, {
                    timeout: timeout,
                    waitUntil: 'domcontentloaded' as PuppeteerLifeCycleEvent
                });
            }
            await savePageContent(pageIndex, args.outDir, page, args.saveScreenshots); 
        };

        // Go to the first url and get all the html content and screenshot
        console.log('Going to the first url', inUrl);
        await navigateWithTimeout(page, inUrl, args.defaultTimeout, args.defaultWaitUntil as PuppeteerLifeCycleEvent);
        
        // Save landing page title
        const title = await page.title();
        output.page_title = title;

        pageIndex++;
        console.log('Saving first page response');

        let duplicatedLinks = [];
        const outputLinks = {
            first_party: [],
            third_party: []
        };

        // deal with redirection

        // get all redirection urls
        output.uri_redirects = page_response
            .request()
            .redirectChain()
            .map(req => {
                return req.url();
            });

        // get final landing url after redirection and categorise first and third party links
        output.uri_dest = page.url();
        duplicatedLinks = await getLinks(page);
        REDIRECTED_FIRST_PARTY = parse(output.uri_dest);
        for (const link of dedupLinks(duplicatedLinks)) {
            const l = parse(link.href);

            if (REDIRECTED_FIRST_PARTY.domain === l.domain) {
                outputLinks.first_party.push(link);
                hosts.links.first_party.add(l.hostname);
            } else {
                if (l.hostname && l.hostname !== 'data') {
                    outputLinks.third_party.push(link);
                    hosts.links.third_party.add(l.hostname);
                }
            }
        }

        //simulate user interaction on the page
        await fillForms(page);
        await autoScroll(page);

        let subDomainLinks = [];
        // www often indicate the main domain of the website
        // only browse links (output link) on the same subdomain as the landing page(output page)
        if (getSubdomain(output.uri_dest) !== 'www') {
            subDomainLinks = outputLinks.first_party.filter(f => {
                return getSubdomain(f.href) === getSubdomain(output.uri_dest);
            });
        } else {
            subDomainLinks = outputLinks.first_party;
        }
        const browse_links = sampleSize(subDomainLinks, args.numPages); // randomly choose <args.numPages> number of links to visit
        output.browsing_history = [output.uri_dest].concat(browse_links.map(l => l.href));
        console.log('About to browse more links');

        // for all the output, non-duplicated links, visit the page(simulate user browsing)
        for (const link of output.browsing_history.slice(1)) {
            logger.log('info', `browsing now to ${link}`, { type: 'Browser' });
            if (didBrowserDisconnect) {
                return {
                    status: 'failed',
                    page_response: 'Chrome crashed'
                };
            }
            if (args.clearCache) {
                await clearCookiesCache(page);
            }
            console.log(`Browsing now to ${link}`);
            
            await navigateWithTimeout(page, link, args.defaultTimeout, args.defaultWaitUntil as PuppeteerLifeCycleEvent);

            await fillForms(page);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

            duplicatedLinks = duplicatedLinks.concat(await getLinks(page));
            await autoScroll(page);

            pageIndex++;
        }

        await captureBrowserCookies(page, args.outDir);
        if (args.captureHar) {
            await har(harOutputPath);
        }

        await closeBrowser(browser);
        if (typeof userDataDir !== 'undefined') {
            clearDir(userDataDir, false);
        }
        // after simulatying user browsing, more links may be collected, so we need to deduplicate and recategorise first and third party links
        const links = dedupLinks(duplicatedLinks);
        output.end_time = new Date();
        for (const link of links) {
            const l = parse(link.href);

            if (REDIRECTED_FIRST_PARTY.domain === l.domain) {
                outputLinks.first_party.push(link);
                hosts.links.first_party.add(l.hostname);
            } else {
                if (l.hostname && l.hostname !== 'data') {
                    outputLinks.third_party.push(link);
                    hosts.links.third_party.add(l.hostname);
                }
            }
        }

        // generate report
        const fpRequests = Array.from(hosts.requests.first_party);
        const tpRequests = Array.from(hosts.requests.third_party);
        const incorrectTpAssignment = tpRequests.filter((f: string) => getDomain(f) === REDIRECTED_FIRST_PARTY.domain);
        output.hosts = {
            requests: {
                first_party: fpRequests.concat(incorrectTpAssignment),
                third_party: tpRequests.filter(t => !incorrectTpAssignment.includes(t))
            }
        };

        if (args.captureLinks) {
            output.links = outputLinks;
            output.social = getSocialLinks(links);
        }

        // this is what we will use to run test and generate report
        const event_data_all = await new Promise(done => {
            logger.query(
                {
                    start: 0,
                    order: 'desc',
                    limit: Infinity,
                    fields: ['message']
                },
                (err, results) => {
                    if (err) {
                        console.log(`Couldnt load event data ${JSON.stringify(err)}`);
                        return done([]);
                    }

                    return done(results.file);
                }
            );
        });

        if (!Array.isArray(event_data_all)) {
            return {
                status: 'failed',
                page_response: 'Couldnt load event data'
            };
        }
        if (event_data_all.length < 1) {
            return {
                status: 'failed',
                page_response: 'Couldnt load event data'
            };
        }

        // filter only events with type set
        const event_data = event_data_all.filter(event => {
            return !!event.message.type;
        });
        // We only consider something to be a third party tracker if:
        // The domain is different to that of the final url (after any redirection) of the page the user requested to load.
        // where the test is run and gerenate report 
        const reports = args.blTests.reduce((acc, cur) => {
            acc[cur] = generateReport(cur, event_data, args.outDir, REDIRECTED_FIRST_PARTY.domain);
            return acc;
        }, {});

        const json_dump = JSON.stringify({ ...output, reports }, null, 2);
        writeFileSync(join(args.outDir, 'inspection.json'), json_dump);
        if (args.outDir.includes('bl-tmp')) {
            clearDir(args.outDir, false);
        }
        return { 
            status: 'success', 
            ...output, 
            reports,
        };
    } finally {
        if (browser && !didBrowserDisconnect) {
            await closeBrowser(browser);
        }
    }
};
