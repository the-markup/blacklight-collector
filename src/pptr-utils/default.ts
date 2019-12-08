import { LaunchOptions } from "puppeteer";

/**
 * Default Puppeteer options for production i.e deploying on Docker
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#tips
 */
const pptrOptsProduction = {
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors",
    "--autoplay-policy=no-user-gesture-required"
  ],
  executablePath: "google-chrome-unstable",
  headless: true
};

/**
 * Default Puppeteer options for dev
 */
const pptrOptsDev = {
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors",
    "--autoplay-policy=no-user-gesture-required"
  ],
  headless: true
};

/**
 * @param {boolean} headless  - Will run the tasks without displaying them if set to true
 * @param {Array} args - Other args to pass to chrome via puppeteer
 */
export let defaultPuppeteerBrowserOptions: LaunchOptions =
  process.env.PRODUCTION || process.env.TESTING
    ? pptrOptsProduction
    : pptrOptsDev;
