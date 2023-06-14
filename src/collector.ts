import { writeFileSync } from 'fs';
import sampleSize from 'lodash.samplesize';
import os from 'os';
import { join } from 'path';
import puppeteer, { Browser, Page, PuppeteerLifeCycleEvent, KnownDevices, PuppeteerLaunchOptions } from 'puppeteer';
import PuppeteerHar from 'puppeteer-har';
import { getDomain, getSubdomain, parse } from 'tldts';
import url from 'url';
import { captureBrowserCookies, clearCookiesCache, setupHttpCookieCapture } from './cookie-collector';
import { setupBlacklightInspector } from './inspector';
import { setupKeyLoggingInspector } from './key-logging';
import { getLogger } from './logger';
import { generateReport } from './parser';
import { defaultPuppeteerBrowserOptions, savePageContent } from './pptr-utils/default';
import { dedupLinks, getLinks, getSocialLinks } from './pptr-utils/get-links';
import { autoScroll, fillForms } from './pptr-utils/interaction-utils';
import { setupSessionRecordingInspector } from './session-recording';
import { setUpThirdPartyTrackersInspector } from './third-party-trackers';
import { clearDir } from './utils';

export type CollectorOptions = Partial<typeof DEFAULT_OPTIONS>;

const DEFAULT_OPTIONS = {
    outDir: join(process.cwd(), 'bl-tmp'),
    title: 'Blacklight Inspection',
    emulateDevice: 'iPhone 13 Mini' as keyof typeof KnownDevices,
    captureHar: true,
    captureLinks: false,
    enableAdBlock: false,
    clearCache: true,
    quiet: true,
    headless: true,
    defaultTimeout: 30000,
    numPages: 3,
    defaultWaitUntil: 'networkidle2' as PuppeteerLifeCycleEvent,
    saveBrowserProfile: false,
    saveScreenshots: true,
    blTests: [
        'behaviour_event_listeners',
        'canvas_fingerprinters',
        'canvas_font_fingerprinters',
        'cookies',
        'fb_pixel_events',
        'key_logging',
        'session_recorders',
        'third_party_trackers'
    ],
    puppeteerExecutablePath: null as string|null,
    extraChromiumArgs: [] as string[],
    extraPuppeteerOptions: {} as Partial<PuppeteerLaunchOptions>
}

export const collector = async (inUrl: string, args: CollectorOptions) => {
    args = { ...DEFAULT_OPTIONS, ...args };
    clearDir(args.outDir);
    const FIRST_PARTY = parse(inUrl);
    let REDIRECTED_FIRST_PARTY = parse(inUrl);
    const logger = getLogger({ outDir: args.outDir, quiet: args.quiet });

    const output: any = {
        args: args.title,
        uri_ins: inUrl,
        uri_dest: null,
        uri_redirects: null,
        secure_connection: {},
        host: url.parse(inUrl).hostname,
        config: {
            cleareCache: args.clearCache,
            captureHar: args.captureHar,
            captureLinks: args.captureLinks,
            enableAdBlock: args.enableAdBlock,
            emulateDevice: args.emulateDevice,
            numPages: args.numPages
        },
        browser: null,
        script: {
            host: os.hostname(),
            version: {
                npm: require('../package.json').version,
                commit: null
            },
            node_version: process.version
        },
        start_time: new Date(),
        end_time: null
    };
    if (args.emulateDevice) {
        output.deviceEmulated = args.emulateDevice;
    }

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

    let browser: Browser;
    let page: Page;
    let pageIndex = 1;
    let har = {} as any;
    let page_response = null;
    let loadError = false;
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
    browser = await puppeteer.launch(options);
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
    if (args.emulateDevice) {
        page.emulate(KnownDevices[args.emulateDevice]);
    }

    // record all requested hosts
    await page.on('request', request => {
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

    if (args.clearCache) {
        await clearCookiesCache(page);
    }

    // Init blacklight instruments on page
    await setupBlacklightInspector(page, logger.warn);
    await setupKeyLoggingInspector(page, logger.warn);
    await setupHttpCookieCapture(page, logger.warn);
    await setupSessionRecordingInspector(page, logger.warn);
    await setUpThirdPartyTrackersInspector(page, logger.warn, args.enableAdBlock);

    if (args.captureHar) {
        har = new PuppeteerHar(page);
        await har.start({
            path: args.outDir ? join(args.outDir, 'requests.har') : undefined
        });
    }
    if (didBrowserDisconnect) {
        return {
            status: 'failed',
            page_response: 'Chrome crashed'
        };
    }
    // Go to the url
    page_response = await page.goto(inUrl, {
        timeout: args.defaultTimeout,
        waitUntil: args.defaultWaitUntil as PuppeteerLifeCycleEvent
    });
    await savePageContent(pageIndex, args.outDir, page, args.saveScreenshots);
    pageIndex++;

    let duplicatedLinks = [];
    const outputLinks = {
        first_party: [],
        third_party: []
    };

    // Return if the page doesnt load
    if (loadError) {
        await browser.close();
        if (typeof userDataDir !== 'undefined') {
            clearDir(userDataDir, false);
        }
        if (args.outDir.includes('bl-tmp')) {
            clearDir(args.outDir, false);
        }
        return { status: 'failed', page_response };
    }
    output.uri_redirects = page_response
        .request()
        .redirectChain()
        .map(req => {
            return req.url();
        });

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
    await fillForms(page);

    let subDomainLinks = [];
    if (getSubdomain(output.uri_dest) !== 'www') {
        subDomainLinks = outputLinks.first_party.filter(f => {
            return getSubdomain(f.href) === getSubdomain(output.uri_dest);
        });
    } else {
        subDomainLinks = outputLinks.first_party;
    }
    const browse_links = sampleSize(subDomainLinks, args.numPages);
    output.browsing_history = [output.uri_dest].concat(browse_links.map(l => l.href));

    for (const link of output.browsing_history.slice(1)) {
        logger.log('info', `browsing now to ${link}`, { type: 'Browser' });
        if (didBrowserDisconnect) {
            return {
                status: 'failed',
                page_response: 'Chrome crashed'
            };
        }
        await page.goto(link, {
            timeout: args.defaultTimeout,
            waitUntil: 'networkidle2'
        });

        await savePageContent(pageIndex, args.outDir, page, args.saveScreenshots);
        await fillForms(page);
        await page.waitForTimeout(800);
        pageIndex++;
        duplicatedLinks = duplicatedLinks.concat(await getLinks(page));
        await autoScroll(page);
    }
    await captureBrowserCookies(page, args.outDir);
    if (args.captureHar) {
        await har.stop();
    }

    await browser.close();
    if (typeof userDataDir !== 'undefined') {
        clearDir(userDataDir, false);
    }

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
    const reports = args.blTests.reduce((acc, cur) => {
        acc[cur] = generateReport(cur, event_data, args.outDir, REDIRECTED_FIRST_PARTY.domain);
        return acc;
    }, {});

    const json_dump = JSON.stringify({ ...output, reports }, null, 2);
    writeFileSync(join(args.outDir, 'inspection.json'), json_dump);
    if (args.outDir.includes('bl-tmp')) {
        clearDir(args.outDir, false);
    }
    return { status: 'success', ...output, reports };
};
