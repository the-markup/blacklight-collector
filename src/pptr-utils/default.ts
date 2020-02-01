import fs from "fs";
import { promisify } from "util";
import path from "path";
import { Page } from "puppeteer";
const writeFile = promisify(fs.writeFile);

export const savePageContent = async (
  index,
  outDir,
  page: Page,
  screenshot = true
) => {
  const html = await page.content();
  const outPath = path.join(outDir, `${index}.html`);
  await writeFile(outPath, html);
  if (screenshot) {
    const outPathImg = path.join(outDir, `${index}.jpeg`);
    await page.screenshot({ path: outPathImg, type: "jpeg", quality: 50 });
  }
};
/**
 * Default Puppeteer options for dev
 */
export const defaultPuppeteerBrowserOptions = {
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors",
    "--autoplay-policy=no-user-gesture-required"
  ],
  defaultViewport: null,
  headless: true
};

/**
 * Default Puppeteer options for production i.e deploying on Docker
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#tips
 */
// const pptrOptsDev = {
//   args: [
//     "--no-sandbox",
//     "--disable-dev-shm-usage",
//     "--ignore-certificate-errors",
//     "--autoplay-policy=no-user-gesture-required"
//   ],
// executablePath: "google-chrome-unstable",
//   headless: true
// };

// /**
//  * @param {boolean} headless  - Will run the tasks without displaying them if set to true
//  * @param {Array} args - Other args to pass to chrome via puppeteer
//  */
// export let defaultPuppeteerBrowserOptions: LaunchOptions =
//   process.env.PRODUCTION || process.env.TESTING
//     ? pptrOptsProduction
//     : pptrOptsDev;
