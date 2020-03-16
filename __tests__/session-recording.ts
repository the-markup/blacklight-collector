import { launch } from "puppeteer";
import devices from "puppeteer/DeviceDescriptors";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupSessionRecordingInspector } from "../src/session-recording";
import { autoScroll } from "../src/pptr-utils/interaction-utils";

it.skip("checks network requests for known session recorders", async () => {
  const browser = await launch({
    ...defaultPuppeteerBrowserOptions,
    headless: true
  });
  const page = (await browser.pages())[0];
  await page.emulate(devices["iPhone X"]);
  const rows = [];
  await setupSessionRecordingInspector(page, e => rows.push(e));
  await page.goto(`https://www.jetblue.com`, {
    waitUntil: "networkidle2"
  });
  await autoScroll(page);
  await browser.close();
  expect(rows.length).toBeGreaterThan(0);
});
