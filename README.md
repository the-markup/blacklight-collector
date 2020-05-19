### Install

`npm install`

`npm run build`

### Usage

`node example.js`.

Results are stored in `demo-dir` by default

`collector` takes the following argumnents:

- `inUrl` **required**
  - The URL you want to scrapes
- `outDir`
  - default: saves to tmp directory and deletes after completion
  - To save the full report provide a directory path
- `blTests`
  - Array of Blacklight tests to run
  - default: All Blacklight tests
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
  - Puppeteer makes device emulation pretty easy. Choose from [this list](https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js)
- `captureHar`
  - default: true
  - Boolean flag to save the HTTP requests to a file in the HAR(Http Archive Format).
  - Note: You will need to provide a path to `outDir` if you want to see the captured file
  - _TIP:_ Firefox lets you import a HAR file and visualize it using the network tab in the developer tools
  - You can also view it [here](https://toolbox.googleapps.com/apps/har_analyzer/)
- `captureLinks`
  - default: false
  - Save first and third party links from the pages
- `enableAdBlock`
  - default: false
- `clearCache`
  - default: false
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

```
const { collector } = require("@themarkup/rowdypenguin");
const { join } = require("path");

(async () => {
  // To emulate a device change the value to a name from this array:
  // https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
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

Blacklight wouldnt be possible without the work of [OpenWPM](https://github.com/mozilla/OpenWPM)
and the EU-EDPS's [website evidence collector](https://github.com/EU-EDPS/website-evidence-collector)
