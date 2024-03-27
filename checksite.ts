import fs from 'fs';
import { CollectorOptions, collect } from './src';
import { KnownDevices } from 'puppeteer';
import { join } from 'path';

// turn user input into an output directory path
const getOutDirName = (passed: string | undefined) => {
  const now = new Date();
  const split = now.toISOString().split("T");
  const dateString = split[0].replace(/-/g, "");
  const timeString = split[1].split(".")[0].replace(/:/g, "");

  if (passed === undefined) {
    return `${dateString}-${timeString}`;
  } else {
    return `${dateString}-${timeString}-${passed.toLowerCase().replace(/[^a-z0-9]/gi, "_")}`;
  }
}

(async () => {
  // set up the data dir
  const dataDirPath = join(__dirname, "checksite-data");
  if (!fs.existsSync(dataDirPath)) { fs.mkdirSync(dataDirPath) }

  const EMULATE_DEVICE = 'iPhone 13 Mini';
  // first argument passed to the script is the url to test
  const URL = process.argv.length >= 2 ? process.argv[2] : 'themarkup.org';
  // second argument is the output directory name
  const OUTDIR = getOutDirName(process.argv[3])
  const OUTPATH = join(dataDirPath, OUTDIR);
  // create it if it doesn't exist
  if (!fs.existsSync(OUTPATH)) {
    fs.mkdirSync(OUTPATH);
  }

  const config: CollectorOptions = {
    numPages: 1,
    headless: false,
    emulateDevice: KnownDevices[EMULATE_DEVICE],
    // Uncomment to run with desktop/laptop browser
    // emulateDevice: {
    //     viewport: {height: 1440, width: 800},
    //     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    // },
    outDir: OUTPATH
  };

  console.log(`Beginning scan of ${URL}`);

  const result = await collect(`http://${URL}`, config);

  if (result.status === 'success') {
    console.log(`Scan successful: ${config.outDir}`);
  } else {
    console.error(`Scan failed: ${result.page_response}`);
  }
})();
