/* tslint:disable:no-submodule-imports object-literal-sort-keys*/
import { writeFileSync } from "fs";
import { sampleSize } from "lodash";
import os from "os";
import { join } from "path";
import puppeteer, { Browser, LoadEvent, Page } from "puppeteer";
import PuppeteerHar from "puppeteer-har";
// https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
import devices from "puppeteer/DeviceDescriptors";
import { parse } from "tldts";
import url from "url";
import {
  captureBrowserCookies,
  clearCookiesCache,
  setupHttpCookieCapture,
} from "./cookie-collector";
import { setupBlacklightInspector } from "./inspector";
import { setupKeyLoggingInspector } from "./key-logging";
import { getLogger } from "./logger";
import { generateReport } from "./parser";
import {
  defaultPuppeteerBrowserOptions,
  savePageContent,
} from "./pptr-utils/default";
import { dedupLinks, getLinks, getSocialLinks } from "./pptr-utils/get-links";
import { autoScroll, fillForms } from "./pptr-utils/interaction-utils";
import { setupSessionRecordingInspector } from "./session-recording";
import { clearDir } from "./utils";
import { setupWebBeaconInspector } from "./web-beacon-recording";
export const collector = async ({
  inUrl,
  outDir = join(process.cwd(), "bl-tmp"),
  headless = true,
  title = "Blacklight Inspection",
  emulateDevice = "iPhone X",
  captureHar = true,
  captureLinks = false,
  enableAdBlock = false,
  clearCache = true,
  quiet = true,
  defaultTimeout = 30000,
  numPages = 3,
  defaultWaitUntil = "networkidle2",
  saveBrowserProfile = false,
  saveScreenshots = true,
}) => {
  clearDir(outDir);
  const FIRST_PARTY = parse(inUrl);
  const logger = getLogger({ outDir, quiet });

  const output: any = {
    title,
    uri_ins: inUrl,
    uri_dest: null,
    uri_redirects: null,
    secure_connection: {},
    host: url.parse(inUrl).hostname,
    config: {
      clearCache,
      captureHar,
      captureLinks,
      enableAdBlock,
      emulateDevice,
      numPages,
    },
    browser: null,
    script: {
      host: os.hostname(),
      version: {
        npm: require("../package.json").version,
        commit: null,
      },
      node_version: process.version,
    },
    start_time: new Date(),
    end_time: null,
  };
  if (emulateDevice) {
    output.deviceEmulated = devices[emulateDevice];
  }

  // Log network requests and page links
  const hosts = {
    requests: {
      first_party: new Set(),
      third_party: new Set(),
    },
    links: {
      first_party: new Set(),
      third_party: new Set(),
    },
  };

  let browser: Browser;
  let page: Page;
  let pageIndex = 1;
  let har = {} as any;
  let page_response = null;
  let loadError = false;
  const userDataDir = saveBrowserProfile
    ? join(outDir, "browser-profile")
    : undefined;
  let didBrowserDisconnect = false;
  try {
    const options = {
      ...defaultPuppeteerBrowserOptions,
      headless,
      userDataDir,
    };
    browser = await puppeteer.launch(options);
    browser.on("disconnected", () => {
      didBrowserDisconnect = true;
    });

    if (didBrowserDisconnect) {
      return {
        status: "failed",
        page_response: "Chrome crashed",
      };
    }
    // TODO: Determine how to handle disconnect events to kill the instance gracefully
    // browser.on("disconnected", setup);
    logger.info(`Started Puppeteer with pid ${browser.process().pid}`);
    page = (await browser.pages())[0];
    output.browser = {
      name: "Chromium",
      version: await browser.version(),
      user_agent: await browser.userAgent(),
      platform: {
        name: os.type(),
        version: os.release(),
      },
    };
    if (emulateDevice) {
      const deviceOptions = devices[emulateDevice];
      page.emulate(deviceOptions);
    }
    // record all requested hosts
    await page.on("request", (request) => {
      const l = parse(request.url());
      // note that hosts may appear as first and third party depending on the path
      if (FIRST_PARTY.domain === l.domain) {
        hosts.requests.first_party.add(l.hostname);
      } else {
        if (request.url().indexOf("data://") < 1 && !!l.hostname) {
          hosts.requests.third_party.add(l.hostname);
        }
      }
    });

    if (clearCache) {
      await clearCookiesCache(page);
    }

    // Init blacklight instruments on page
    await setupBlacklightInspector(page, (event) => logger.warn(event));
    await setupKeyLoggingInspector(page, (event) => logger.warn(event));
    await setupHttpCookieCapture(page, (event) => logger.warn(event));
    await setupSessionRecordingInspector(page, (event) => logger.warn(event));
    await setupWebBeaconInspector(
      page,
      (event) => logger.warn(event),
      enableAdBlock
    );
    if (captureHar) {
      har = new PuppeteerHar(page);
      await har.start({
        path: outDir ? join(outDir, "requests.har") : undefined,
      });
    }
    if (didBrowserDisconnect) {
      return {
        status: "failed",
        page_response: "Chrome crashed",
      };
    }
    // Go to the url
    page_response = await page.goto(inUrl, {
      timeout: defaultTimeout,
      waitUntil: defaultWaitUntil as LoadEvent,
    });
    savePageContent(pageIndex, outDir, page, saveScreenshots);
    pageIndex++;
  } catch (error) {
    loadError = true;
    page_response = error;
  }

  let duplicatedLinks = [];
  const outputLinks = {
    first_party: [],
    third_party: [],
  };

  try {
    // Return if the page doesnt load
    if (loadError) {
      await browser.close();
      if (typeof userDataDir !== "undefined") {
        clearDir(userDataDir, false);
      }
      if (outDir.includes("bl-tmp")) {
        clearDir(outDir, false);
      }
      return { status: "failed", page_response };
    }

    duplicatedLinks = await getLinks(page);

    for (const link of dedupLinks(duplicatedLinks)) {
      const l = parse(link.href);

      if (FIRST_PARTY.domain === l.domain) {
        outputLinks.first_party.push(link);
        hosts.links.first_party.add(l.hostname);
      } else {
        if (l.hostname && l.hostname !== "data") {
          outputLinks.third_party.push(link);
          hosts.links.third_party.add(l.hostname);
        }
      }
    }
    await fillForms(page);
    output.uri_redirects = page_response
      .request()
      .redirectChain()
      .map((req) => {
        return req.url();
      });

    output.uri_dest = page.url();

    const browse_links = sampleSize(outputLinks.first_party, numPages);
    output.browsing_history = [output.uri_dest].concat(
      browse_links.map((l) => l.href)
    );

    for (const link of output.browsing_history.slice(1)) {
      logger.log("info", `browsing now to ${link}`, { type: "Browser" });
      if (didBrowserDisconnect) {
        return {
          status: "failed",
          page_response: "Chrome crashed",
        };
      }
      await page.goto(link, {
        timeout: defaultTimeout,
        waitUntil: "networkidle2",
      });

      await fillForms(page);
      await page.waitFor(800);
      savePageContent(pageIndex, outDir, page, saveScreenshots);
      pageIndex++;
      duplicatedLinks = duplicatedLinks.concat(await getLinks(page));
      await autoScroll(page);
    }
    await captureBrowserCookies(page, outDir);
    if (captureHar) {
      await har.stop();
    }
  } catch (error) {
    logger.log(
      "error",
      `couldnt capture browser cookies ${JSON.stringify(error)} `,
      {
        type: "Browser",
      }
    );
  }

  try {
    await browser.close();
    if (typeof userDataDir !== "undefined") {
      clearDir(userDataDir, false);
    }
  } catch (err) {
    logger.log("error", `couldnt cleanup browser ${JSON.stringify(err)} `);
  }

  const links = dedupLinks(duplicatedLinks);
  output.end_time = new Date();
  for (const link of links) {
    const l = parse(link.href);

    if (FIRST_PARTY.domain === l.domain) {
      outputLinks.first_party.push(link);
      hosts.links.first_party.add(l.hostname);
    } else {
      if (l.hostname && l.hostname !== "data") {
        outputLinks.third_party.push(link);
        hosts.links.third_party.add(l.hostname);
      }
    }
  }
  // generate report
  output.hosts = {
    requests: {
      first_party: Array.from(hosts.requests.first_party),
      third_party: Array.from(hosts.requests.third_party),
    },
  };

  if (captureLinks) {
    output.links = outputLinks;
    output.social = getSocialLinks(links);
  }

  const event_data_all = await new Promise((done) => {
    logger.query(
      {
        start: 0,
        order: "desc",
        limit: Infinity,
        fields: ["message"],
      },
      (err, results) => {
        if (err) {
          // tslint:disable-next-line:no-console
          console.log(`Couldnt load event data ${JSON.stringify(err)}`);
          return done([]);
        }

        return done(results.file);
      }
    );
  });

  if (!Array.isArray(event_data_all)) {
    return {
      status: "failed",
      page_response: "Couldnt load event data",
    };
  }
  if (event_data_all.length < 1) {
    return {
      status: "failed",
      page_response: "Couldnt load event data",
    };
  }

  // filter only events with type set
  const event_data = event_data_all.filter((event) => {
    return !!event.message.type;
  });
  const reports = [
    "cookies",
    "behaviour_event_listeners",
    "key_logging",
    "canvas_fingerprinters",
    "canvas_font_fingerprinters",
    "fingerprintable_api_calls",
    "session_recorders",
    "web_beacons",
  ].reduce((acc, cur) => {
    acc[cur] = generateReport(cur, event_data, outDir, inUrl);
    return acc;
  }, {});

  const json_dump = JSON.stringify({ ...output, reports }, null, 2);
  writeFileSync(join(outDir, "inspection.json"), json_dump);
  if (outDir.includes("bl-tmp")) {
    clearDir(outDir, false);
  }
  return { status: "success", ...output, reports };
};
