const { collector } = require("./build");
const { join } = require("path");
(async () => {
  const inUrl = "https://huffingtonpost.com";
  const outDir = join(__dirname, "example-dir");
  await collector({
    headless: true,
    inUrl,
    outDir,
    captureHar: true
  });
})();
