import { join } from "path";
import { generateReport } from "../src/parser";
import { loadEventData } from "../src/utils";
import { launch } from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { Global } from "../src/types";
import { setupBlacklightInspector } from "../src/inspector";
declare var global: Global;
it("can parse AddEventlistener events", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const EVENTS_URL = `${global.__DEV_SERVER__}/session_recorder.html`;
  await setupBlacklightInspector(page, e => rows.push({ message: e }));
  await page.goto(EVENTS_URL, { waitUntil: "networkidle0" });
  const report = generateReport("behaviour_event_listeners", rows, null, null);
  await browser.close();
  expect(report["KEYBOARD"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["keyup"],
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js": [
      "input"
    ]
  });
  expect(report["MOUSE"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["mousedown", "click"],
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js": [
      "mousemove",
      "mouseup",
      "mousedown",
      "click",
      "dblclick",
      "scroll"
    ]
  });
  expect(report["SENSOR"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["deviceorientation"]
  });
  expect(report["TOUCH"]).toEqual({
    "http://localhost:8125/shared/event-listener.js": ["touchend"],
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js": [
      "touchmove",
      "touchstart",
      "touchend"
    ]
  });
});

it("can parse DataExfiltration events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("data_exfiltration", rawEvents, null, null);
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
    "window.navigator.vendor"
  ]
};

const SCREEN_SYMBOLS = {
  "http://localhost:8125/property-enumeration.html": [
    "window.screen.pixelDepth",
    "window.screen.colorDepth"
  ]
};

const MEDIA_DEVICES_SYMBOLS = {
  "http://localhost:8125/property-enumeration.html": [
    "window.navigator.mediaDevices.enumerateDevices"
  ]
};
it("can group fingerprintable window objects", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const PROPERTIES_URL = `${global.__DEV_SERVER__}/property-enumeration.html`;
  await setupBlacklightInspector(page, e => rows.push({ message: e }));
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
});
