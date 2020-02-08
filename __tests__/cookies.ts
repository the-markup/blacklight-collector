import { launch, Page } from "puppeteer";

import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { reportCookieEvents } from "../src/parser";
import { setupBlacklightInspector } from "../src/inspector";
import { loadEventData } from "../src/utils";
import { join } from "path";
import {
  captureBrowserCookies,
  setupHttpCookieCapture,
  getJsCookies
} from "../src/cookie-collector";
import { existsSync } from "fs";
import { getLogger } from "../src/logger";
jest.setTimeout(20000);

const PP_TEST_RESULT =  [
    {
      "name": "__cfduid",
      "value": "db2c641370bd7a3fd33d8bea75832a6ae1581108098",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1583700098.585116,
      "size": 51,
      "httpOnly": true,
      "secure": false,
      "session": false,
      "sameSite": "Lax",
      "expiresUTC": "2020-03-08T20:41:38.585Z",
      "expiresDays": 30
    },
    {
      "name": "pp-tracking",
      "value": "{\"pageCount\":0}",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1612644099,
      "size": 26,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2021-02-06T20:41:39.000Z",
      "expiresDays": 365
    },
    {
      "name": "_ga",
      "value": "GA1.2.1970530455.1581108102",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1644180101,
      "size": 30,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2022-02-06T20:41:41.000Z",
      "expiresDays": 730
    },
    {
      "name": "_gid",
      "value": "GA1.2.1822615051.1581108102",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1581194501,
      "size": 31,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2020-02-08T20:41:41.000Z",
      "expiresDays": 1
    },
    {
      "name": "_dc_gtm_UA-3742720-1",
      "value": "1",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1581108161,
      "size": 21,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2020-02-07T20:42:41.000Z",
      "expiresDays": 0
    },
    {
      "name": "_gat_UA-3742720-1",
      "value": "1",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1581108161,
      "size": 18,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2020-02-07T20:42:41.000Z",
      "expiresDays": 0
    },
    {
      "name": "NID",
      "value": "197=Dy67opR0BYBdwBZfw77X2naL_e7wrj5VsmJMRvgD2GO-J_uV4gxfpmAuQ0Iqe6TCVBbH7bzGlKvl7SBq5MKB8mwUyjcsWRiPe0qJ1WHjpAlJfC2Sz5Qq_h3NyaAUGxeEC8dyZ8PboPGYSLhmLnG3N2hROXUGvdaLdGWl7wyHfzU",
      "domain": "google.com",
      "path": "/",
      "expires": 1596919302.931949,
      "size": 178,
      "httpOnly": true,
      "secure": false,
      "session": false,
      "expiresUTC": "2020-08-08T20:41:42.931Z",
      "expiresDays": 183
    },
    {
      "name": "_cb_ls",
      "value": "1",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1615236103,
      "size": 7,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2021-03-08T20:41:43.000Z",
      "expiresDays": 395
    },
    {
      "name": "_cb",
      "value": "BixIFGDxD23uUIE4R",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1615236103,
      "size": 20,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2021-03-08T20:41:43.000Z",
      "expiresDays": 395
    },
    {
      "name": "_chartbeat2",
      "value": ".1581108103113.1581108103113.1.1ewKpB4rhWpDM0cQSC48rxTJ2NK7.1",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1615236103,
      "size": 72,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2021-03-08T20:41:43.000Z",
      "expiresDays": 395
    },
    {
      "name": "_cb_svref",
      "value": "null",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1581109903,
      "size": 13,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2020-02-07T21:11:43.000Z",
      "expiresDays": 0.02
    },
    {
      "name": "pp_newsletter_interstitial_display",
      "value": "true",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1612644103,
      "size": 38,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2021-02-06T20:41:43.000Z",
      "expiresDays": 365
    },
    {
      "name": "pp_page_count",
      "value": "1",
      "domain": "propublica.org",
      "path": "/",
      "expires": 1612644103,
      "size": 14,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2021-02-06T20:41:43.000Z",
      "expiresDays": 365
    },
    {
      "name": "pardot",
      "value": "nb0v647ai5at2tm95bgqt1o7c5",
      "domain": "pi.pardot.com",
      "path": "/",
      "expires": -1,
      "size": 32,
      "httpOnly": false,
      "secure": false,
      "session": true
    },
    {
      "name": "visitor_id125411",
      "value": "418216265",
      "domain": "pardot.com",
      "path": "/",
      "expires": 1896468103.414256,
      "size": 25,
      "httpOnly": false,
      "secure": true,
      "session": false,
      "sameSite": "None",
      "expiresUTC": "2030-02-04T20:41:43.414Z",
      "expiresDays": 3650
    },
    {
      "name": "visitor_id125411-hash",
      "value": "7dfb277b9516e2962b93e5e467874b6dfba3cccacb825fa6a65d8c09cc5d36707302c57711becb164b58bae1130fb398c47ebfde",
      "domain": "pardot.com",
      "path": "/",
      "expires": 1896468103.41438,
      "size": 125,
      "httpOnly": false,
      "secure": true,
      "session": false,
      "sameSite": "None",
      "expiresUTC": "2030-02-04T20:41:43.414Z",
      "expiresDays": 3650
    },
    {
      "name": "lpv125411",
      "value": "aHR0cHM6Ly93d3cucHJvcHVibGljYS5vcmcv",
      "domain": "pi.pardot.com",
      "path": "/",
      "expires": 1581109903.414433,
      "size": 45,
      "httpOnly": false,
      "secure": true,
      "session": false,
      "sameSite": "None",
      "expiresUTC": "2020-02-07T21:11:43.414Z",
      "expiresDays": 0.02
    },
    {
      "name": "visitor_id125411",
      "value": "418216265",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1896468103,
      "size": 25,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2030-02-04T20:41:43.000Z",
      "expiresDays": 3650
    },
    {
      "name": "visitor_id125411-hash",
      "value": "7dfb277b9516e2962b93e5e467874b6dfba3cccacb825fa6a65d8c09cc5d36707302c57711becb164b58bae1130fb398c47ebfde",
      "domain": "www.propublica.org",
      "path": "/",
      "expires": 1896468103,
      "size": 125,
      "httpOnly": false,
      "secure": false,
      "session": false,
      "expiresUTC": "2030-02-04T20:41:43.000Z",
      "expiresDays": 3650
    },
    {
      "name": "pardot",
      "value": "adtp0qpo7tbdm0fv189ei5a62p",
      "domain": "go.propublica.org",
      "path": "/",
      "expires": -1,
      "size": 32,
      "httpOnly": false,
      "secure": false,
      "session": true
    },
    {
      "name": "visitor_id125411",
      "value": "418216265",
      "domain": "go.propublica.org",
      "path": "/",
      "expires": 1896468103.806138,
      "size": 25,
      "httpOnly": false,
      "secure": true,
      "session": false,
      "sameSite": "None",
      "expiresUTC": "2030-02-04T20:41:43.806Z",
      "expiresDays": 3650
    },
    {
      "name": "visitor_id125411-hash",
      "value": "b2311dc89284703ba9fc459e483eb37e7fbc0b7bcb7e2694c72c520768fa878aa57dfa84d1d623a29045846e4b162580e5a09a1c",
      "domain": "go.propublica.org",
      "path": "/",
      "expires": 1896468103.806214,
      "size": 125,
      "httpOnly": false,
      "secure": true,
      "session": false,
      "sameSite": "None",
      "expiresUTC": "2030-02-04T20:41:43.806Z",
      "expiresDays": 3650
    }
  ]

// FIXME: Make a more robust test page for testing cookies. Relying on a real website that can change is silly.
it("can capture cookies from the browser, javascript and network requests", async () => {
  const CAPTURE_TEST_URL = "propublica.org";
  const CAPTURE_TEST_DIR = join(__dirname, "test-data", `${CAPTURE_TEST_URL}-capture-test`);
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const logger = getLogger({ outDir: CAPTURE_TEST_DIR, quiet: true });
  const PAGE_URL = `https://www.propublica.org`;
  await setupBlacklightInspector(page, e => logger.warn(e));
  await setupHttpCookieCapture(page, e => logger.warn(e));
  await page.goto(PAGE_URL, { waitUntil: "networkidle2" });
  await captureBrowserCookies(page, CAPTURE_TEST_DIR);
  expect(existsSync(join(CAPTURE_TEST_DIR, "browser-cookies.json"))).toBe(true);
  await browser.close();
});
// This test doesnt work because the number of cookies might change
it("can match blacklight cookie events to those stored by the browser", async () => {
  const TEST_URL = "propublica.org";
  const TEST_DIR = join(__dirname, "test-data", TEST_URL);
  const rawEvents = loadEventData(TEST_DIR).map(m => m.message);
  const cookies = reportCookieEvents(rawEvents, TEST_DIR, TEST_URL);
  expect(cookies.map(n => n.name).sort()).toEqual(PP_TEST_RESULT.map(n => n.name).sort();
});

it("wont mess up if the there are no cookies on the page", async () => {
  const TEST_URL = "propublica.org";
  const TEST_DIR = join(__dirname, "test-data", TEST_URL);
  const cookies = reportCookieEvents([], TEST_DIR, TEST_URL);
  expect(cookies.map(n => n.name).sort()).toEqual(PP_TEST_RESULT.map(n => n.name).sort();
});

it("can handle badly formed events", async () => {
     const event ={ data:
       { operation: 'set',
         symbol: 'window.document.cookie',
         value:
          'visitor_id1=25411;expires=Sat, 02 Feb 2030 23:37:23 GMT;path=/' },
      stack:
       [ { columnNumber: 42,
           lineNumber: 252,
           functionName: 'HTMLDocument.set',
           source: '    at HTMLDocument.set (<anonymous>:252:42)' },
         { columnNumber: 3662,
           lineNumber: 2,
           fileName: 'https://pi.pardot.com/pd.js',
           functionName: 'piSetCookie',
           source: '    at piSetCookie (https://pi.pardot.com/pd.js:2:3662)' },
         { columnNumber: 4,
           lineNumber: 4,
           fileName:
            'https://pi.pardot.com/analytics?ver=3&visitor_id=&pi_opt_in=&campaign_id=1035&account_id=126411&title=ProPublica%20%E2%80%94%20Investigative%20Journalism%20and%20News%20in%20the%20Public%20Interest&url=https%3A%2F%2Fwww.propublica.org%2F&referrer=',
           functionName: 'piResponse',
           source:
            '    at piResponse (https://pi.pardot.com/analytics?ver=3&visitor_id=&pi_opt_in=&campaign_id=1035&account_id=126411&title=ProPublica%20%E2%80%94%20Investigative%20Journalism%20and%20News%20in%20the%20Public%20Interest&url=https%3A%2F%2Fwww.propublica.org%2F&referrer=:4:4)' },
         { columnNumber: 1,
           lineNumber: 24,
           fileName:
            'https://pi.pardot.com/analytics?ver=3&visitor_id=&pi_opt_in=&campaign_id=1035&account_id=126411&title=ProPublica%20%E2%80%94%20Investigative%20Journalism%20and%20News%20in%20the%20Public%20Interest&url=https%3A%2F%2Fwww.propublica.org%2F&referrer=',
           source:
            '    at https://pi.pardot.com/analytics?ver=3&visitor_id=&pi_opt_in=&campaign_id=1035&account_id=126411&title=ProPublica%20%E2%80%94%20Investigative%20Journalism%20and%20News%20in%20the%20Public%20Interest&url=https%3A%2F%2Fwww.propublica.org%2F&referrer=:24:1' } ],
      type: 'JsInstrument.ObjectProperty',
      url: 'https://www.propublica.org/' }
        const rawEvents = getJsCookies([event], 'whatever')//.map(m => m.message);
        
        expect(getJsCookies([event], 'whatever')).toHaveLength(1)
        event.data.value = 'totesfuckedcookie;expires=Sat, 02 Feb 2030 23:37:23 GMT;path=/'
        expect(getJsCookies([event], 'whatever')).toHaveLength(0)
  
})

// TODO: See what to do about this
// it.skip("can report cookies used by a website", async () => {
//   const browser = await launch(defaultPuppeteerBrowserOptions);
//   const page = (await browser.pages())[0];
//   const rows = [];
//   const URL = `https://girlscouts.org`;
//   await setupBlacklightInspector(page, e => rows.push(e));
//   await setupHttpCookieCapture(page, e => rows.push(e));
//   await page.goto(URL, { waitUntil: "networkidle2" });
//   const allCookies = await captureBrowserCookies(page, TEST_DIR);
//   await browser.close();
//   const cookies = matchCookiesToEvents(allCookies, rows, URL);
//   console.log(
//     cookies.map(c => ({
//       domain: c.domain,
//       name: c.name,
//       path: c.path,
//       third_party: c.third_party
//     }))
//   );
// });
