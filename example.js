const { collector } = require("./build");
const { join } = require("path");

(async () => {
  // To emulate a device change the value to a name from this array:
  // https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
  const EMULATE_DEVICE = "iPhone X";

  // Save the results to a folder
  let OUT_DIR = true;

  // The URL to test
  const URL = "www.jetblue.com";

  const defaultConfig = {
    inUrl: `http://${URL}`,
    numPages: 3,
    headless: true,
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
