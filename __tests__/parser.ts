import { join } from "path";
import { generateReport } from "../src/parser";
import { loadEventData } from "../src/helpers/utils";
import puppeteer from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { Global } from "../src/types";
import { setUpThirdPartyTrackersInspector } from "../src/inspectors/third-party-trackers";
import { setupBlacklightInspector } from "../src/inspectors/inspector";
declare var global: Global;
it("can parse AddEventlistener events", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const EVENTS_URL = `${global.__DEV_SERVER__}/session_recorder.html`;
  await setupBlacklightInspector(page, (e) => rows.push({ message: e }));
  await page.goto(EVENTS_URL, { waitUntil: "networkidle0" });
  const report = generateReport("behaviour_event_listeners", rows, null, null);
  await browser.close();
  expect(report["KEYBOARD"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["keyup"],
    "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/record/rrweb-record.min.js": [
      "input",
    ],
  });
  expect(report["MOUSE"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["mousedown", "click"],
    "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/record/rrweb-record.min.js": [
      "mousemove",
      "mouseup",
      "mousedown",
      "click",
      "dblclick",
      "scroll",
    ],
  });
  expect(report["SENSOR"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["deviceorientation"],
  });
  expect(report["TOUCH"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["touchend"],
    "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/record/rrweb-record.min.js": [
      "touchmove",
      "touchstart",
      "touchend",
      "touchcancel",
    ],
  });
});
it("can parse session recording events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunitedsession");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("session_recorders", rawEvents, null, null);
  expect(Object.keys(report)).toEqual(["leadid.com", "fullstory.com/s/fs.js"]);
});
it("can parse key logging events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("key_logging", rawEvents, null, null);
  expect(Object.keys(report)).toEqual(["leadid.com", "fullstory.com"]);
});

const NAVIGATOR_SYMBOLS = {
  "http://localhost:8125/property-enumeration.html": [
    "window.navigator.appCodeName",
    "window.navigator.appName",
    "window.navigator.appVersion",
    "window.navigator.cookieEnabled",
    "window.navigator.doNotTrack",
    "window.navigator.geolocation",
    "window.navigator.language",
    "window.navigator.languages",
    "window.navigator.onLine",
    "window.navigator.platform",
    "window.navigator.product",
    "window.navigator.productSub",
    "window.navigator.userAgent",
    "window.navigator.vendorSub",
    "window.navigator.vendor",
  ],
};

const SCREEN_SYMBOLS = {
  "http://localhost:8125/property-enumeration.html": [
    "window.screen.pixelDepth",
    "window.screen.colorDepth",
  ],
};

const MEDIA_DEVICES_SYMBOLS = {
  "http://localhost:8125/property-enumeration.html": [
    "window.navigator.mediaDevices.enumerateDevices",
  ],
};
it("can group fingerprintable window objects", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const PROPERTIES_URL = `${global.__DEV_SERVER__}/property-enumeration.html`;
  await setupBlacklightInspector(page, (e) => rows.push({ message: e }));
  await page.goto(PROPERTIES_URL, { waitUntil: "networkidle0" });
  const output = await generateReport(
    "fingerprintable_api_calls",
    rows,
    null,
    null
  );
  await browser.close();
  expect(output["NAVIGATOR"]).toEqual(NAVIGATOR_SYMBOLS);
  expect(output["SCREEN"]).toEqual(SCREEN_SYMBOLS);
  expect(output["MEDIA_DEVICES"]).toEqual(MEDIA_DEVICES_SYMBOLS);
}, 60000);

it("can parse FB Pixel tracking events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited-1.0.3");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("fb_pixel_events", rawEvents, null, null);
  const pageUrls = [
    "https://www.veteransunited.com/",
    "https://www.veteransunited.com/copyright/",
    "https://www.veteransunited.com/va-loans/va-home-loan-advantages/",
    "https://www.veteransunited.com/va-loans/va-jumbo-loans/",
  ];
  expect(report.length).toBe(4);
  expect(report.map((r) => r.pageUrl).sort()).toEqual(pageUrls.sort());
  expect(report[0].advancedMatchingParams.length).toEqual(4);
  expect(report[0].eventName).toBe("PageView");
  expect(report[0].eventDescription).toBe(
    "This is the default pixel tracking page visits. For example - A person lands on your website pages."
  );
});
it.skip("can parse FB Pixel tracking events - live capture", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const url = "https://vogue.com";
  await setUpThirdPartyTrackersInspector(page, (e) =>
    rows.push({ message: e })
  );
  await page.goto(url, { waitUntil: "networkidle2" });
  await browser.close();
  const report = generateReport("fb_pixel_events", rows, null, null);
  expect(report.map((r) => r.eventName)).toContain("PageView");
});

it("can parse Google Analytics tracking events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited-1.0.3");
  const rawEvents = loadEventData(TEST_DIR);
  const pageUrls = [
    'https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j82&tid=UA-30102-16&cid=852100309.1589758701&jid=2012734374&gjid=2113596298&_gid=1708403671.1589758701&_u=YGBAgEABAAAAIE~&z=549701973',
    'https://stats.g.doubleclick.net/j/collect?t=dc&aip=1&_r=3&v=1&_v=j82&tid=UA-30102-16&cid=852100309.1589758701&jid=1563152953&gjid=595724329&_gid=1708403671.1589758701&_u=yDCAgEABAAAAIE~&z=176641512'
  ];
  const report = generateReport("google_analytics_events", rawEvents, null, null);
  expect(report.length).toBe(2);
  expect(report.map((r) => r.url).sort()).toEqual(pageUrls.sort());
});
