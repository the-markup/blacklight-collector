import { KnownDevices } from "puppeteer";
import { CollectorOptions, collect } from "./src";
import { join } from 'path';

(async () => {
    // const URL = 'example.com';
    const URL = 'www.gothamist.com';
    const EMULATE_DEVICE = 'iPhone 13 Mini';

    const config: CollectorOptions = {
        numPages: 3,
        headless: false,
        emulateDevice: KnownDevices[EMULATE_DEVICE],
        // Uncomment to run with desktop/laptop browser
        // emulateDevice: {
        //     viewport: {height: 1440, width: 800}, 
        //     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        // },
        outDir: join(__dirname, 'demo-dir'),
    };

    console.log(`Beginning scan of ${URL}`);

    const result = await collect(`http://${URL}`, config);

    if (result.status === 'success') {
        console.log(`Scan successful: ${config.outDir}`);
    } else {
        console.error(`Scan failed: ${result.page_response}`);
    }
})();
