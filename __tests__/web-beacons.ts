import { launch } from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupWebBeaconInspector } from "../src/web-beacon-recording";
jest.setTimeout(10000);
it("emits an event when a page makes a request to a url from the easyprivacy lis", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  await setupWebBeaconInspector(page, e => rows.push(e));
  await page.goto(`https://huffingtonpost.com`);
  await browser.close();
  expect(rows.length).toBeGreaterThan(0);
});
