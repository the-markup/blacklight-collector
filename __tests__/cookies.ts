import { launch, Page } from "puppeteer";

import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { reportCookieEvents } from "../src/parser";
import { setupBlacklightInspector } from "../src/inspector";
import { getScriptUrl, loadEventData } from "../src/utils";
import { Cookie } from "tough-cookie";
import { getHostname } from "tldts";
import { flatten } from "lodash";
import { join } from "path";
import {
  captureBrowserCookies,
  matchCookiesToEvents,
  setupHttpCookieCapture,
  loadBrowserCookies
} from "../src/cookie-collector";
import { jsInstruments } from "../src/plugins/js-instrument";
import { fstat, writeFileSync, readFileSync, existsSync } from "fs";
import { getLogger } from "../src/logger";
jest.setTimeout(20000);

const PP_TEST_RESULT = [
  {
    name: "visitor_id125411-hash",
    value:
      "45d1dbf3dbdcaec71e03ab979ff8625e66c10cc9e58a8870a508adf4b6b97c9bef9f6764589ffba25511c19c27d6b6bb400bfb33",
    domain: "go.propublica.org",
    path: "/",
    expires: 1891969357.486406,
    size: 125,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2029-12-14T19:02:37.486Z",
    expiresDays: 3650,
    type: "unknown",
    third_party: false
  },
  {
    name: "visitor_id125411",
    value: "404630043",
    domain: "go.propublica.org",
    path: "/",
    expires: 1891969357.486318,
    size: 25,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2029-12-14T19:02:37.486Z",
    expiresDays: 3650,
    type: "unknown",
    third_party: false
  },
  {
    name: "visitor_id125411-hash",
    value:
      "b278a3a686a7ea00ea56945730c7ff4e4f9bb49b95c745244114d330b76aecebe46ee8e44f8617139593072e8dd6f32e86cbf828",
    domain: "pardot.com",
    path: "/",
    expires: 1891969357.364412,
    size: 125,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2029-12-14T19:02:37.364Z",
    expiresDays: 3650,
    type: "unknown",
    third_party: true
  },
  {
    name: "visitor_id125411",
    value: "404630043",
    domain: "pardot.com",
    path: "/",
    expires: 1891969357.36434,
    size: 25,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2029-12-14T19:02:37.364Z",
    expiresDays: 3650,
    type: "unknown",
    third_party: true
  },
  {
    name: "visitor_id125411-hash",
    value:
      "b278a3a686a7ea00ea56945730c7ff4e4f9bb49b95c745244114d330b76aecebe46ee8e44f8617139593072e8dd6f32e86cbf828",
    domain: "www.propublica.org",
    path: "/",
    expires: 1891969357,
    size: 125,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2029-12-14T19:02:37.000Z",
    expiresDays: 3650,
    type: "unknown",
    third_party: false
  },
  {
    name: "visitor_id125411",
    value: "404630043",
    domain: "www.propublica.org",
    path: "/",
    expires: 1891969357,
    size: 25,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2029-12-14T19:02:37.000Z",
    expiresDays: 3650,
    type: "unknown",
    third_party: false
  },
  {
    name: "_ga",
    value: "GA1.2.1035605960.1576609357",
    domain: "propublica.org",
    path: "/",
    expires: 1639681356,
    size: 30,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2021-12-16T19:02:36.000Z",
    expiresDays: 730,
    type: "js",
    third_party: false
  },
  {
    name: "_cb",
    value: "CxmLba4lDVJD5feqj",
    domain: "www.propublica.org",
    path: "/",
    expires: 1610737357,
    size: 20,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2021-01-15T19:02:37.000Z",
    expiresDays: 395,
    type: "unknown",
    third_party: false
  },
  {
    name: "_chartbeat2",
    value: ".1576609357224.1576609357224.1.PHqSgCkcGajBhLo4V156_sB7NNcf.1",
    domain: "www.propublica.org",
    path: "/",
    expires: 1610737357,
    size: 72,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2021-01-15T19:02:37.000Z",
    expiresDays: 395,
    type: "unknown",
    third_party: false
  },
  {
    name: "_cb_ls",
    value: "1",
    domain: "www.propublica.org",
    path: "/",
    expires: 1610737357,
    size: 7,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2021-01-15T19:02:37.000Z",
    expiresDays: 395,
    type: "unknown",
    third_party: false
  },
  {
    name: "pp-tracking",
    value: '{"pageCount":0}',
    domain: "www.propublica.org",
    path: "/",
    expires: 1608145355,
    size: 26,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2020-12-16T19:02:35.000Z",
    expiresDays: 365,
    type: "unknown",
    third_party: false
  },
  {
    name: "NID",
    value:
      "193=r2gEHtMdYhh3PIk8A5_0NSEihR6ri4N5Dn92jseil3jf6KpqUnlx9-syh5c0IiyeIoRSOSfRcqJubIYwg2Xm6u6KQC0RLYEQGYqeLEGnfI5edbYotTtBZNcVA83rO6FWkRJRiy7Bhf9wpP3qn5prKiJsxltx4IsbyYKekj7CNO4",
    domain: "google.com",
    path: "/",
    expires: 1592420557.240679,
    size: 178,
    httpOnly: true,
    secure: false,
    session: false,
    expiresUTC: "2020-06-17T19:02:37.240Z",
    expiresDays: 183,
    type: "unknown",
    third_party: true
  },
  {
    name: "_fbp",
    value: "fb.1.1576609356483.938438702",
    domain: "propublica.org",
    path: "/",
    expires: 1584385357,
    size: 32,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2020-03-16T19:02:37.000Z",
    expiresDays: 90,
    type: "js",
    third_party: false
  },
  {
    name: "fr",
    value: "0ibcmICEiBkaYy6hW..Bd-SZM...1.0.Bd-SZM.",
    domain: "facebook.com",
    path: "/",
    expires: 1584385356.496285,
    size: 41,
    httpOnly: true,
    secure: true,
    session: false,
    sameSite: "None",
    expiresUTC: "2020-03-16T19:02:36.496Z",
    expiresDays: 90,
    type: "unknown",
    third_party: true
  },
  {
    name: "__cfduid",
    value: "d12cccf1d0c5f877fb4ce3ba5e974d9131576609355",
    domain: "propublica.org",
    path: "/",
    expires: 1579201355.789408,
    size: 51,
    httpOnly: true,
    secure: false,
    session: false,
    sameSite: "Lax",
    expiresUTC: "2020-01-16T19:02:35.789Z",
    expiresDays: 30,
    type: "http",
    third_party: false
  },
  {
    name: "_gid",
    value: "GA1.2.727233668.1576609357",
    domain: "propublica.org",
    path: "/",
    expires: 1576695756,
    size: 30,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2019-12-18T19:02:36.000Z",
    expiresDays: 1,
    type: "js",
    third_party: false
  },
  {
    name: "lpv125411",
    value: "aHR0cHM6Ly93d3cucHJvcHVibGljYS5vcmcv",
    domain: "pi.pardot.com",
    path: "/",
    expires: 1576611157.364474,
    size: 45,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2019-12-17T19:32:37.364Z",
    expiresDays: 0.02,
    type: "unknown",
    third_party: true
  },
  {
    name: "_cb_svref",
    value: "null",
    domain: "www.propublica.org",
    path: "/",
    expires: 1576611157,
    size: 13,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2019-12-17T19:32:37.000Z",
    expiresDays: 0.02,
    type: "unknown",
    third_party: false
  },
  {
    name: "_gat_UA-3742720-1",
    value: "1",
    domain: "propublica.org",
    path: "/",
    expires: 1576609416,
    size: 18,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2019-12-17T19:03:36.000Z",
    expiresDays: 0,
    type: "js",
    third_party: false
  },
  {
    name: "_dc_gtm_UA-3742720-1",
    value: "1",
    domain: "propublica.org",
    path: "/",
    expires: 1576609416,
    size: 21,
    httpOnly: false,
    secure: false,
    session: false,
    expiresUTC: "2019-12-17T19:03:36.000Z",
    expiresDays: 0,
    type: "js",
    third_party: false
  },
  {
    name: "pardot",
    value: "mt9v537un9oh4esqgk2qrpmo4e",
    domain: "pi.pardot.com",
    path: "/",
    expires: -1,
    size: 32,
    httpOnly: false,
    secure: false,
    session: true,
    type: "unknown",
    third_party: true
  },
  {
    name: "pardot",
    value: "99qrvri6s2eff2jta3em1sijv8",
    domain: "go.propublica.org",
    path: "/",
    expires: -1,
    size: 32,
    httpOnly: false,
    secure: false,
    session: true,
    type: "unknown",
    third_party: false
  }
];

it("can capture cookies from the browser and JS and Network requets", async () => {
  const CAPTURE_TEST_URL = "propublica.org";
  const CAPTURE_TEST_DIR = join(__dirname, "test-data", CAPTURE_TEST_URL);
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const logger = getLogger({ outDir: CAPTURE_TEST_DIR, quiet: true });
  const PAGE_URL = `https://propublica.org`;
  await setupBlacklightInspector(page, e => logger.warn(e));
  await setupHttpCookieCapture(page, e => logger.warn(e));
  await page.goto(PAGE_URL, { waitUntil: "networkidle2" });
  await captureBrowserCookies(page, CAPTURE_TEST_DIR);
  expect(existsSync(join(CAPTURE_TEST_DIR, "browser-cookies.json"))).toBe(true);
  await browser.close();
});
it.only("can match blacklight cookie events to those stored by the browser", async () => {
  const TEST_URL = "propublica.org";
  const TEST_DIR = join(__dirname, "test-data", TEST_URL);
  const rawEvents = loadEventData(TEST_DIR).map(m => m.message);
  const cookies = reportCookieEvents(rawEvents, TEST_DIR, TEST_URL);
  expect(cookies).toEqual(PP_TEST_RESULT);
});
it.skip("can report cookies used by a website", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows = [];
  const URL = `https://girlscouts.org`;
  await setupBlacklightInspector(page, e => rows.push(e));
  await setupHttpCookieCapture(page, e => rows.push(e));
  await page.goto(URL, { waitUntil: "networkidle2" });
  const allCookies = await captureBrowserCookies(page, TEST_DIR);
  await browser.close();
  const cookies = matchCookiesToEvents(allCookies, rows, URL);
  console.log(
    cookies.map(c => ({
      domain: c.domain,
      name: c.name,
      path: c.path,
      third_party: c.third_party
    }))
  );
});
