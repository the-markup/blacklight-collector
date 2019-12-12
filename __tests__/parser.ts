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

const NAVIGATOR_SYMBOLS = [
  {
    symbol: "window.navigator.appCodeName",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.appName",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.appVersion",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.cookieEnabled",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.doNotTrack",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.geolocation",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.language",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.languages",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.onLine",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.platform",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.product",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.productSub",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.userAgent",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.vendorSub",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.navigator.vendor",
    script: "http://localhost:8125/property-enumeration.html"
  }
];

const SCREEN_SYMBOLS = [
  {
    symbol: "window.screen.height",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.screen.width",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.screen.pixelDepth",
    script: "http://localhost:8125/property-enumeration.html"
  },
  {
    symbol: "window.screen.colorDepth",
    script: "http://localhost:8125/property-enumeration.html"
  }
];

const MEDIA_DEVICES_SYMBOLS = [
  {
    symbol: "window.navigator.mediaDevices.enumerateDevices",
    script: "http://localhost:8125/property-enumeration.html"
  }
];
it("can group fingerprintable window objects", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const PROPERTIES_URL = `${global.__DEV_SERVER__}/property-enumeration.html`;
  await setupBlacklightInspector(page, e => rows.push({ message: e }));
  await page.goto(PROPERTIES_URL, { waitUntil: "networkidle0" });
  const output = await generateReport("fingerprintable_api_calls", rows);
  expect(output["NAVIGATOR"]).toEqual(NAVIGATOR_SYMBOLS);
  expect(output["SCREEN"]).toEqual(SCREEN_SYMBOLS);
  expect(output["MEDIA_DEVICES"]).toEqual(MEDIA_DEVICES_SYMBOLS);
  await browser.close();
});
