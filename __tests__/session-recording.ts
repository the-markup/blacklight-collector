import { launch, KnownDevices } from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupSessionRecordingInspector } from "../src/session-recording";
import { autoScroll } from "../src/pptr-utils/interaction-utils";
import { BlacklightEvent } from "../src/types";

jest.setTimeout(30000); // This is a long-running test
it("checks network requests for known session recorders", async () => {
  const browser = await launch({
    ...defaultPuppeteerBrowserOptions,
    headless: true,
  });

  const page = (await browser.pages())[0];
  await page.emulate(KnownDevices["iPhone 13 Mini"]);
  const rows: BlacklightEvent[] = [];
  await setupSessionRecordingInspector(page, (e) => rows.push(e));
  await page.goto(`https://www.hotjar.com`, {
    waitUntil: "networkidle2",
  });
  await autoScroll(page);
  await browser.close();
  expect(rows.length).toBeGreaterThan(0);
});
