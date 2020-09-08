# Blacklight-Collector

For more information about the `blacklight-collector` please reade our methodology. TK LINK

## Install

`npm install`

`npm run build`

## Usage

`node example.js`.

Results are stored in `demo-dir` by default

## Collector configuration

`collector` takes the following arguments:

- `inUrl` **required**
  - The URL you want to scrapes
- `outDir`
  - default: saves to tmp directory and deletes after completion
  - To save the full report provide a directory path
- `blTests`
  - Array of tests to run
  - default: All
    - "behaviour_event_listeners"
    - "canvas_fingerprinters"
    - "canvas_font_fingerprinters"
    - "cookies"
    - "fb_pixel_events"
    - "key_logging"
    - "session_recorders"
    - "third_party_trackers"
- `numPages`
  - default: 3
  - crawl depth
- `headless`
  - Boolean flag, useful for debugging.
- `emulateDevice`
  - Puppeteer makes device emulation pretty easy. Choose from [this list](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-puppeteerdevices)
- `captureHar`
  - default: true
  - Boolean flag to save the HTTP requests to a file in the HAR(Http Archive Format).
  - Note: You will need to provide a path to `outDir` if you want to see the captured file
- `captureLinks`
  - default: false
  - Save first and third party links from the pages
- `enableAdBlock`
  - default: false
- `clearCache`
  - default: true
  - Clear the browser cookies and cache
- `saveBrowsingProfile`
  - default: false
  - Lets you optionally save the browsing profile to the `outDir`
- `quiet`
  - default: true
  - dont pipe raw event data to stdout
- `title`
  - default: 'Blacklight Inspection'
- `saveScreenshots`
  - default: true
- `defaultTimeout`
  - default: 30000
  - amount of time the page will wait to load
- `defaultWaitUntil`
  - default: 'networkidle2'
  - [Other options](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagegotourl-options)

## Inspection Result

`blacklight-collector` creates a few different assets at the end of an inspection, these include:
 - **browser-cookies.json**
   - JSON file containing a list of all the cookies set on that website.
 - **inspection-log.ndjson**
   - This file contains all the raw events that are recorded during the inspection which are used for analysis.
 - **inspection.json**: 
   - Final inspection report that includes the following keys:
     - `browser`: Details of the browser version used.
     - `browsing_history`: List of pages that were visited
     - `config`: Inspection (configuration)[##Configuration]
     - `deviceEmulated`: Information about the device that was emulated for this inspection.
     - `end_time`: When the inspection ended.
     - `host`: The hostname of the visited website.
     - `hosts`: A list of first-party and third-party hosts visited on this inspection.
     - `reports`: The initial results of the tests blacklight runs. For more information please read the methodology. LINK TK
     - `script`: Details about the NodeJS version, host and this package version.
     - `start_time`: When the inspection began.
     - `uri_ins`: The URL that was entered by the user.
     - `uri_dest`: The final url that was visited after any redirects.
     - `uri_redirects`: The redirect chain.
 - **n.html**
   - Nth inspected page's html source
 - **n.jpeg**
   - Nth inspected page's screenshot
  - **requests.har**
    - HTTP archive of all the network requests.
    - _TIP:_ Firefox lets you import a HAR file and visualize it using the network tab in the developer tools.
    - You can also view it [here](https://toolbox.googleapps.com/apps/har_analyzer/).

```
const { collector } = require("@themarkup/blacklight-collector");
const { join } = require("path");

(async () => {
  const EMULATE_DEVICE = false;

 // Save the results to a folder
  let OUT_DIR = true;

  // The URL to test
  const URL = "jetblue.com";

  const defaultConfig = {
    inUrl: `http://${URL}`,
    numPages: 2,
    headless: false,
    emulateDevice: EMULATE_DEVICE
  };

  const result = await collector(
    OUT_DIR
      ? { ...defaultConfig, ...{ outDir: join(__dirname, "demo-dir") } }
      : defaultConfig
  );
  if (OUT_DIR) {
    console.log(
      `For captured data please look in ${join(__dirname, "demo-dir")}`
    );
  }
})();

```



Blacklight would not be possible without the work of [OpenWPM](https://github.com/mozilla/OpenWPM)
and the EU-EDPS's [website evidence collector](https://github.com/EU-EDPS/website-evidence-collector)
