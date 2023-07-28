
import { KnownDevices } from "puppeteer";
import { CollectorOptions, collect } from "./src";
import { join } from 'path';

(async () => {
    // const URL = 'example.com';
    // const URL = 'npr.org';
    const URL = 'cnn.com';
    const EMULATE_DEVICE = 'iPhone 13 Mini';

    const config: CollectorOptions = {
        numPages: 1,
        headless: true,
        emulateDevice: KnownDevices[EMULATE_DEVICE],
        // Uncomment to run with desktop/laptop browser
        // emulateDevice: {
        //     viewport: {height: 1440, width: 800}, 
        //     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        // },
        outDir: join(__dirname, 'demo-dir'),
    };

    console.log(`Beginning scan of ${URL}`);

    await collect(`http://${URL}`, config);

    console.log(`Scan complete: ${config.outDir}`);
})();
