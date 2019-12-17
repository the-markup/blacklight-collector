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
  const report = generateReport("behaviour_event_listeners", rows);
  await browser.close();
  expect(report["KEYBOARD"]).toEqual([
    {
      name: "keyup",
      script: "http://localhost:8125/shared/event-listener.js"
    },
    {
      name: "input",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    }
  ]);
  expect(report["MOUSE"]).toEqual([
    {
      name: "mousedown",
      script: "http://localhost:8125/shared/event-listener.js"
    },
    {
      name: "click",
      script: "http://localhost:8125/shared/event-listener.js"
    },
    {
      name: "mousemove",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "mouseup",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "mousedown",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "click",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "dblclick",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "scroll",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    }
  ]);
  expect(report["SENSOR"]).toEqual([
    {
      name: "deviceorientation",
      script: "http://localhost:8125/shared/event-listener.js"
    }
  ]);
  expect(report["TOUCH"]).toEqual([
    {
      name: "touchend",
      script: "http://localhost:8125/shared/event-listener.js"
    },
    {
      name: "touchmove",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "touchstart",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    },
    {
      name: "touchend",
      script:
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    }
  ]);
});

it("can parse DataExfiltration events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("data_exfiltration", rawEvents);
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
it.only("can group fingerprintable window objects", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const PROPERTIES_URL = `${global.__DEV_SERVER__}/property-enumeration.html`;
  await setupBlacklightInspector(page, e => rows.push({ message: e }));
  await page.goto(PROPERTIES_URL, { waitUntil: "networkidle0" });
  const output = await generateReport("fingerprintable_api_calls", rows);
  await browser.close();
  expect(output["NAVIGATOR"]).toEqual(NAVIGATOR_SYMBOLS);
  expect(output["SCREEN"]).toEqual(SCREEN_SYMBOLS);
  expect(output["MEDIA_DEVICES"]).toEqual(MEDIA_DEVICES_SYMBOLS);
});
