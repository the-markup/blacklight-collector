const { collector } = require("./build");
const { join } = require("path");
// Lisst of devices you can emulate
// https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js
(async () => {
  const URL = "example.com";
  const inUrl = `https://${URL}`;
  const outDir = join(__dirname, "example-result", URL);
  const result = await collector({
    inUrl,
    outDir,
    numPages: 2,
    captureLinks: false,
    headless: false,
    captureHar: true
  });

  console.log(result);
  console.log(`For captured data please look in ${outDir}`);
})();
