import { collector } from "../src/collector";
import { Global } from "../src/types";
import { join } from "path";
import fs from "fs";
import generate from "@babel/generator";
import { clearDir } from "../src/utils";
import { launch } from "puppeteer";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import {
  getLinks,
  dedupLinks,
  getSocialLinks
} from "../src/pptr-utils/get-links";
declare var global: Global;
// jest.setTimeout(1000);

const TEST_LINKS = [
  {
    href: "http://localhost:8125/some_other_page.html",
    inner_text: "A FAKE HTML PAGE IN SIMPLE!",
    inner_html: "A FAKE HTML PAGE IN SIMPLE!"
  },
  {
    href: "http://localtest.me:8000/test_pages/simple_c.html",
    inner_text: "Click me!",
    inner_html: "Click me!"
  },
  {
    href: "http://localhost:8125/simple_d.html",
    inner_text: "Click me also!",
    inner_html: "Click me also!"
  },
  {
    href: "https://www.example.com/",
    inner_text: "Go to example.com",
    inner_html: "Go to example.com"
  },
  {
    href: "http://example.com/test.html?localtest.me",
    inner_text: "Go to example.com",
    inner_html: "Go to example.com"
  },
  {
    href: "http://localhost:8125/keyLogging.html",
    inner_text: "An HTML PAGE IN INDEX!",
    inner_html: "An HTML PAGE IN INDEX!"
  }
];

const SOCIAL_LINKS = [
  {
    href: "https://www.youtube.com/user/VeteransUnited",
    inner_text: "youtube",
    inner_html: "youtube"
  },
  {
    href: "https://twitter.com/tracking",
    inner_text: "twitter",
    inner_html: "twitter"
  },
  {
    href: "https://instagram.com/tracking",
    inner_text: "instagram",
    inner_html: "instagram"
  },
  {
    href:
      "http://www.facebook.com/sharer.php?u=https%3A%2F%2Fwww.realtor.com%2F100k-veteran-home-sweepstakes",
    inner_text: "fb",
    inner_html: "fb"
  },
  {
    href:
      "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.realtor.com%2F100k-veteran-home-sweepstakes",
    inner_text: "linkedin",
    inner_html: "linkedin"
  },
  {
    href:
      "http://pinterest.com/pin/create/button/?url=https%3A%2F%2Fwww.realtor.com%2F100k-veteran-home-sweepstakes&media=https://static.rdc.moveaws.com/images/vu-100k-entry-og-logo.jpg&description=I%20entered%20to%20win%20%24100K%20toward%20a%20new%20home%20from%20%40veteransunited%20%26%20%40realtordotcom%21%20No%20purchase%20necessary.%20Ends%2012%2F20%2F2019.%20Enter%20today%20and%20see%20Official%20Rules%3A%20https%3A%2F%2Fwww.realtor.com%2F100k-veteran-home-sweepstakes",
    inner_text: "pinterest",
    inner_html: "pinterest"
  }
];
it("can get links from multiple pages and deduplicate them", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  await page.goto(`${global.__DEV_SERVER__}/simple.html`);
  let dupeLinks = await getLinks(page);
  await page.goto(`${global.__DEV_SERVER__}/index.html`);
  dupeLinks = dupeLinks.concat(await getLinks(page));
  const links = dedupLinks(dupeLinks);
  await browser.close();
  expect(links).toEqual(TEST_LINKS);
});

it("can get social links", async () => {
  const browser = await launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  await page.goto(`${global.__DEV_SERVER__}/social.html`);
  let dupeLinks = await getLinks(page);
  const links = dedupLinks(dupeLinks);
  expect(getSocialLinks(links)).toEqual(SOCIAL_LINKS);
  await browser.close();
});
// describe("collector", () => {
//   it("can run", async () => {
//     const TEST_URL = `${global.__DEV_SERVER__}/session_recorder.html`;
//     const TEST_DIR = join(__dirname, "test-data", "collector-test");
//     await collector({
//       headless: true,
//       inUrl: TEST_URL,
//       outDir: TEST_DIR,
//       captureHar: false
//     });
//     clearDir(TEST_DIR);
//   });
// });
