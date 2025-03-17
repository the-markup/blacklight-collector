import fs from 'fs';
import path from 'path';
import { Page } from 'puppeteer';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

export const savePageContent = async (index, outDir, page: Page, screenshot = true) => {
    try {
        const html = await page.content();
        const outPath = path.join(outDir, `${index}.html`);
        await writeFile(outPath, html);
        if (screenshot) {
            const outPathImg = path.join(outDir, `${index}.jpeg`);
            await page.screenshot({ path: outPathImg, type: 'jpeg', quality: 50 });
        }
    } catch (error) {
        console.log(`couldnt save page content: ${JSON.stringify(error)}`);
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