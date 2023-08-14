import { launch, devices } from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupSessionRecordingInspector } from "../src/session-recording";
import { autoScroll } from "../src/pptr-utils/interaction-utils";
// jest.setTimeout(30000);
it.skip("checks network requests for known session recorders", async () => {
  const browser = await launch({
    ...defaultPuppeteerBrowserOptions,
    headless: true,
  });

  const page = (await browser.pages())[0];
  await page.emulate(devices["iPhone 13 Mini"]);
  const rows = [];
  await setupSessionRecordingInspector(page, (e) => rows.push(e));
  await page.goto(`https://www.jetblue.com`, {
    waitUntil: "networkidle2",
  });
  await autoScroll(page);
  await browser.close();
  expect(rows.length).toBeGreaterThan(0);
});
