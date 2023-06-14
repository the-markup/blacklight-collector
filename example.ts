import { CollectorOptions, collector } from "./src";
import { join } from 'path';

(async () => {
    const URL = 'example.com';
    const EMULATE_DEVICE = 'iPhone 13 Mini';

    const config: CollectorOptions = {
        numPages: 3,
        headless: true,
        emulateDevice: EMULATE_DEVICE,
        outDir: join(__dirname, 'demo-dir')
    };

    console.log(`Beginning scan of ${URL}`);

    await collector(`http://${URL}`, config);

    console.log(`Scan complete: ${config.outDir}`);
})();
