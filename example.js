const { collector } = require("./build");
const { join } = require("path");
(async () => {
  const URL = "girlscouts.org";
  const inUrl = `http://${URL}`;
  const outDir = join(__dirname, "example-dir");
  await collector({
    headless: true,
    inUrl,
    outDir,
    captureHar: true
  });
})();
