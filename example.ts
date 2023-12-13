import fs from 'fs';
import { CollectorOptions, collect } from './src';
import { KnownDevices } from 'puppeteer';
import { join } from 'path';

(async () => {
    const EMULATE_DEVICE = 'iPhone 13 Mini';
    // first argument passed to the script is the url to test
    const URL = process.argv.length >= 2 ? process.argv[2] : 'example.com';
    // second argument is the output directory name; make sure it's filesystem-safe
    const OUTDIR = process.argv.length >= 3 ? process.argv[3].replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'demo-dir';
    const OUTPATH = join(__dirname, OUTDIR);
    // and create it if it doesn't exist
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
