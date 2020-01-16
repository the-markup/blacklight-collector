const { collector } = require("./build");
const { join } = require("path");

(async () => {
  // To emulate a device change the value to a name from this array:
  // https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
  const EMULATE_DEVICE = false;

  // Save the results to a folder
  let OUT_DIR = false;

  // The URL to test
  const URL = "nytimes.com";

  const defaultConfig = {
    inUrl: `https://${URL}`,
    numPages: 2,
    headless: true,
    emulateDevice: EMULATE_DEVICE
  };

  const result = await collector(
    OUT_DIR
      ? defaultConfig
      : { ...defaultConfig, ...{ outDir: join(__dirname, URL) } }
  );

  console.log(result);
  if (OUT_DIR) {
    console.log(`For captured data please look in ${outDir}`);
  }
})();
