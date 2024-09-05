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

export const SOCIAL_URLS = [
    'facebook.com',
    'linkedin.com',
    'twitter.com',
    'youtube.com',
    'instagram.com',
    'flickr.com',
    'tumblr.com',
    'snapchat.com',
    'whatsapp.com',
    'docs.google.com',
    'goo.gl',
    'pinterest.com',
    'bit.ly',
    'evernote.com',
    'eventbrite.com',
    'dropbox.com',
    'slideshare.net',
    'vimeo.com',
    'x.com',
    'bsky.app',
    'tiktok.com',
    'mastodon.social',
    'threads.net',
    'wechat.com',
    'messenger.com',
    'telegram.org',
    'douyin.com',
    'kuaishou.com',
    'weibo.com',
    'im.qq.com',
];