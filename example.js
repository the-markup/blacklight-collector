const { collector } = require("./build");
const { join } = require("path");
// Lisst of devices you can emulate
// https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
(async () => {
  const URL = "veteransunited.com";
  const inUrl = `http://${URL}`;
  const outDir = join(__dirname, "example-dir");
  const result = await collector({
    inUrl,
    outDir,
    numPages: 3,
    headless: true,
    captureHar: true
  });

  console.log(result);
  console.log(`For captured data please look in ${outDir}`);
})();
