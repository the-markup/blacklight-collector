import puppeteer from "puppeteer";
import { getLogger } from "./logger";
import { clearDir } from "./utils";
import { join } from "path";
import url from "url";
import os from "os";
// https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
import devices from "puppeteer/DeviceDescriptors";
import PuppeteerHar from "puppeteer-har";
import { setupBlacklightInspector } from "./inspector";
import { setupDataExfiltrationInspector } from "./data-exfiltration";
import { writeFileSync } from "fs";
import { fillForms, autoScroll } from "./pptr-utils/interaction-utils";
import { defaultPuppeteerBrowserOptions } from "./pptr-utils/default";
import { generateReport } from "./parser";
import { getLinks, dedupLinks, getSocialLinks } from "./pptr-utils/get-links";
import { sampleSize } from "lodash";
import { setupWebBeaconInspector } from "./web-beacon-recording";
import { parse } from "tldts";
export const collector = async ({
  inUrl,
  outDir,
  headless = true,
  title = "Blacklight Inspection",
  emulateDevice = "iPhone X",
  captureHar = true,
  captureLinks = false,
  enableAdBlock = false,
  saveBrowserProfile = false,

  quiet = true,
  numPages = 3
}) => {
  const FIRST_PARTY = parse(inUrl);
  clearDir(outDir);
  const logger = getLogger({ outDir, quiet });
  const userDataDir = saveBrowserProfile
    ? join(outDir, "browser-profile")
    : undefined;
  const options = {
    ...defaultPuppeteerBrowserOptions,
    headless,
    userDataDir
  };
  const browser = await puppeteer.launch(options);

  let output: any = {
    title: title,
    uri_ins: inUrl,
    uri_dest: null,
    uri_redirects: null,
    secure_connection: {},
    host: url.parse(inUrl).hostname,
    config: {
      captureHar,
      captureLinks,
      enableAdBlock,
      emulateDevice,
      numPages,
      saveBrowserProfile
    },
    script: {
      host: os.hostname(),
      //TODO:
      // version: {
      // npm: testing ? require("./package.json").version :require("./package.json").version,
      // commit: null
      // },
      node_version: process.version
    },
    browser: {
      name: "Chromium",
      version: await browser.version(),
      user_agent: await browser.userAgent(),
      platform: {
        name: os.type(),
        version: os.release()
      }
    },
    start_time: new Date(),
    end_time: null
  };

  let hosts = {
    requests: {
      first_party: new Set(),
      third_party: new Set()
    },
    links: {
      first_party: new Set(),
      third_party: new Set()
    }
  };

  const page = (await browser.pages())[0];

  if (emulateDevice) {
    const deviceOptions = devices[emulateDevice];
    page.emulate(deviceOptions);
    output.deviceEmulated = deviceOptions;
  }

  // record all requested hosts
  await page.on("request", request => {
    const l = parse(request.url());
    // note that hosts may appear as first and third party depending on the path
    if (FIRST_PARTY.domain === l.domain) {
      hosts.requests.first_party.add(l.hostname);
    } else {
      if (request.url().indexOf("data://") < 0) {
        hosts.requests.third_party.add(l.hostname);
      }
    }
  });

  await setupBlacklightInspector(page, event => logger.warn(event));
  await setupDataExfiltrationInspector(page, event => logger.warn(event));
  await setupWebBeaconInspector(
    page,
    event => logger.warn(event),
    enableAdBlock
  );

  let har = {} as any;
  if (captureHar) {
    har = new PuppeteerHar(page);
    await har.start({
      path: outDir ? join(outDir, "requests.har") : undefined
    });
  }

  let page_response = await page.goto(inUrl, {
    timeout: 0,
    waitUntil: "networkidle2"
  });

  let duplicatedLinks = await getLinks(page);
  const outputLinks = {
    first_party: [],
    third_party: []
  };
  for (const link of dedupLinks(duplicatedLinks)) {
    const l = parse(link.href);

    if (FIRST_PARTY.domain === l.domain) {
      outputLinks.first_party.push(link);
      hosts.links.first_party.add(l.hostname);
    } else {
      outputLinks.third_party.push(link);
      hosts.links.third_party.add(l.hostname);
    }
  }
  await fillForms(page);
  output.uri_redirects = page_response
    .request()
    .redirectChain()
    .map(req => {
      return req.url();
    });

  output.uri_dest = page.url();

  let browse_links = sampleSize(outputLinks.first_party, numPages);
  output.browsing_history = [output.uri_dest].concat(
    browse_links.map(l => l.href)
  );

  for (const link of output.browsing_history.slice(1)) {
    logger.log("info", `browsing now to ${link}`, { type: "Browser" });
    await page.goto(link, { timeout: 0, waitUntil: "networkidle2" });

    await page.waitFor(500); // in ms
    await fillForms(page);
    await page.waitFor(100);
    duplicatedLinks = duplicatedLinks.concat(await getLinks(page));
    await autoScroll(page);
  }

  if (captureHar) {
    await har.stop();
  }
  await browser.close();

  const links = dedupLinks(duplicatedLinks);
  output.end_time = new Date();
  for (const link of links) {
    const l = parse(link.href);

    if (FIRST_PARTY.domain === l.domain) {
      outputLinks.first_party.push(link);
      hosts.links.first_party.add(l.hostname);
    } else {
      outputLinks.third_party.push(link);
      hosts.links.third_party.add(l.hostname);
    }
  }
  // generate report
  output.hosts = {
    requests: {
      first_party: Array.from(hosts.requests.first_party),
      third_party: Array.from(hosts.requests.third_party)
    }
  };

  if (captureLinks) {
    output.links = outputLinks;
    output.social = getSocialLinks(links);
  }

  let event_data_all: any = await new Promise((resolve, reject) => {
    logger.query(
      {
        start: 0,
        order: "desc",
        limit: Infinity
      },
      (err, results) => {
        if (err) return reject(err);
        return resolve(results.file);
      }
    );
  });

  // filter only events with type set
  let event_data = event_data_all.filter(event => {
    return !!event.message.type;
  });
  const reports = [
    "behaviour_event_listeners",
    "data_exfiltration",
    "canvas_fingerprinters",
    "canvas_font_fingerprinters",
    "web_beacons"
  ].reduce((acc, cur) => {
    acc[cur] = generateReport(cur, event_data);
    return acc;
  }, {});

  let json_dump = JSON.stringify({ ...output, reports }, null, 2);
  writeFileSync(join(outDir, "inspection.json"), json_dump);
  return { ...output, reports };
};
