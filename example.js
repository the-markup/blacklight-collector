const { collector } = require("./build");
const { join } = require("path");

(async () => {
  // To emulate a device change the value to a name from this array:
  // https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
  const EMULATE_DEVICE = "iPhone X";

  // Save the results to a folder
  let OUT_DIR = true;

  // The URL to test
  const URL = "jetblue.com";

  const defaultConfig = {
    inUrl: `http://${URL}`,
    numPages: 4,
    headless: false,
    emulateDevice: EMULATE_DEVICE
  };

  const result = await collector(
    OUT_DIR
      ? { ...defaultConfig, ...{ outDir: join(__dirname, "example") } }
      : defaultConfig
  );
  if (OUT_DIR) {
    console.log(
      `For captured data please look in ${join(__dirname, "example")}`
    );
  }
})();
