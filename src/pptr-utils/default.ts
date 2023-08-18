import fs from 'fs';
import path from 'path';
import { Page } from 'puppeteer';
import { promisify } from 'util';
const writeFile = promisify(fs.writeFile);

export const savePageContent = async (index, outDir, page: Page, screenshot = true) => {
    try {
        console.log(`Saving ${index}.html`);
        const html = await page.content();
        const outPath = path.join(outDir, `${index}.html`);
        await writeFile(outPath, html);
        if (screenshot) {
            console.log(`Saving ${index}.jpeg`);
            const outPathImg = path.join(outDir, `${index}.jpeg`);
            console.log('About to screenshot');
            await page.screenshot({ path: outPathImg, type: 'jpeg', quality: 50 });
            console.log('done with screenshot');
        }
    } catch (error) {
        console.log(`couldnt save page content: ${error.message}`);
    }
};
/**
 * Default Puppeteer options for dev
 */
export const defaultPuppeteerBrowserOptions = {
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: null,
    headless: true
};
