const { collector } = require('./build');
const { join } = require('path');

(async () => {
    const URL = 'example.com';
    const EMULATE_DEVICE = 'iPhone 13 Mini';

    const config = {
        inUrl: `http://${URL}`,
        numPages: 3,
        headless: true,
        emulateDevice: EMULATE_DEVICE,
        outDir: join(__dirname, 'demo-dir')
    };

    console.log(`Beginning scan of ${URL}`);

    await collector(config);

    console.log(`Scan complete: ${config.outDir}`);
})();
