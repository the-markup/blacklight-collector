const { KnownDevices } = require('puppeteer');
const { collect } = require('./build/index');
const { join } = require('path');

(async () => {
    const URL = 'digg.com';
    const EMULATE_DEVICE = 'iPhone 13 Mini';

    const config = {
        numPages: 3,
        headless: false,
        emulateDevice: KnownDevices[EMULATE_DEVICE],
        // Uncomment to run with desktop/laptop browser
        // emulateDevice: {
        //     viewport: {height: 1440, width: 800}, 
        //     userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        // },
        outDir: join(__dirname, 'demo-dir'),
    };

    console.log(`Beginning scan of ${URL}`);

    await collect(`http://${URL}`, config);

    console.log(`Scan complete: ${config.outDir}`);
})();
