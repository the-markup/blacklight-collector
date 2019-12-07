import puppeteer from "puppeteer";
import { getLogger } from "./logger";
import { isFirstParty, clearDir, getFirstPartyPs } from "./utils";
import { join } from "path";
import url from "url";
import os from "os";
// https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
import devices from "puppeteer/DeviceDescriptors";
import PuppeteerHar from "puppeteer-har";
import { setupBlacklightInspector } from "./inspector";
import { writeFileSync } from "fs";
import { fillForms } from "./pptr-utils/interaction-utils";
import { defaultPuppeteerBrowserOptions } from "./pptr-utils/default";

export const collector = async ({
  inUrl,
  outDir = "",
  headless = true,
  title = "Blacklight Inspection",
  emulateDevice = "",
  captureHar = true,
  quiet = true
}) => {
  const FIRST_PARTY_PS = getFirstPartyPs(inUrl);
  // console.log(RESF_REGEXP);
  clearDir(outDir);
  const logger = getLogger({ outDir, quiet });
  const options = { ...defaultPuppeteerBrowserOptions, headless };
  // options.userDataDir = outDir ? join(outDir, "browser-profile") : undefined;
  const browser = await puppeteer.launch(options);

  let output: any = {
    title: title,
    uri_ins: inUrl,
    uri_dest: null,
    uri_redirects: null,
    secure_connection: {},
    host: url.parse(inUrl).hostname,
    script: {
      host: os.hostname(),
      version: {
        // npm: testing ? require("./package.json").version :require("./package.json").version,
        commit: null
      },
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
    }
  };

  const page = await browser.newPage();

  if (emulateDevice) {
    const deviceOptions = devices[emulateDevice];
    page.emulate(deviceOptions);
  }

  // record all requested hosts
  await page.on("request", request => {
    const l = url.parse(request.url());
    // note that hosts may appear as first and third party depending on the path
    if (isFirstParty(FIRST_PARTY_PS, l)) {
      hosts.requests.first_party.add(l.hostname);
    } else {
      if (l.protocol != "data:") {
        hosts.requests.third_party.add(l.hostname);
      }
    }
  });

  await setupBlacklightInspector(page, event => logger.warn(event));
  let har = {} as any;
  if (captureHar) {
    har = new PuppeteerHar(page);
    await har.start({
      path: outDir ? join(outDir, "requests.har") : undefined
    });
  }

  let page_response = await page.goto(inUrl, {
    timeout: 0,
    waitUntil: "networkidle0"
  });

  await fillForms(page);
  output.uri_redirects = page_response
    .request()
    .redirectChain()
    .map(req => {
      return req.url();
    });

  if (captureHar) {
    await har.stop();
  }
  await browser.close();

  output.end_time = new Date();

  // go to first page and collect links for additional pages
  // go to multiple pages
  // generate report
  output.hosts = {
    requests: {
      first_party: Array.from(hosts.requests.first_party),
      third_party: Array.from(hosts.requests.third_party)
    }
  };
  let json_dump = JSON.stringify(output, null, 2);
  writeFileSync(join(outDir, "inspection.json"), json_dump);
};
