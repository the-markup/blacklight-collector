import puppeteer from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setUpThirdPartyTrackersInspector } from "../src/inspectors/third-party-trackers";
import { generateReport } from "../src/parser";
import { getDomain } from "tldts";

jest.setTimeout(50000);
it("captures requests that match the easyprivacy list ", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  await setUpThirdPartyTrackersInspector(page, (e) =>
    rows.push({ message: e })
  );
  await page.goto(`https://jetblue.com`, { waitUntil: "networkidle2" });
  await browser.close();
  const output = await generateReport(
    "third_party_trackers",
    rows,
    null,
    "jetblue.com"
  );
  expect(rows.length).toBeGreaterThan(0);
  const allDomains = new Set();
  rows.map((r) => allDomains.add(getDomain(r.message.url)));
  const tpDomains = new Set();
  output.map((r) => tpDomains.add(getDomain(r.url)));
  expect(allDomains.has("jetblue.com")).toBe(true);
  expect(tpDomains.has("jetblue.com")).toBe(false);
});

it("considers the first party domain to be the domain set after any redirects ", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  await setUpThirdPartyTrackersInspector(page, (e) =>
    rows.push({ message: e })
  );
  await page.goto(`https://nyt.com`, { waitUntil: "networkidle2" });
  await browser.close();
  const output = await generateReport(
    "third_party_trackers",
    rows,
    null,
    "nytimes.com"
  );
  expect(rows.length).toBeGreaterThan(0);
  const allDomains = new Set();
  rows.map((r) => allDomains.add(getDomain(r.message.url)));
  const tpDomains = new Set();
  output.map((r) => tpDomains.add(getDomain(r.url)));
  expect(allDomains.has("nytimes.com")).toBe(true);
  expect(tpDomains.has("nytimes.com")).toBe(false);
});

it("does not include any analytics that might be hosted by the first party ", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  await setUpThirdPartyTrackersInspector(page, (e) =>
    rows.push({ message: e })
  );
  await page.goto(`https://eff.org`, { waitUntil: "networkidle2" });
  await browser.close();
  const output = await generateReport(
    "third_party_trackers",
    rows,
    null,
    "eff.org"
  );
  expect(rows.length).toBeGreaterThan(0);
  expect(output.length).toBe(0);
});
