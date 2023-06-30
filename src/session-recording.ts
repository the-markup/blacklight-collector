import { Page } from 'puppeteer';
import { BlacklightEvent, SESSION_RECORDERS_LIST } from './types';

export const setupSessionRecordingInspector = async (page: Page, eventDataHandler: (event: BlacklightEvent) => void) => {
    page.on('request', async request => {
        const parsedUrl = new URL(request.url());
        const cleanUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        const stack = [
            {
                fileName: request.frame() ? request.frame().url() : ''
            }
        ];
        const matches = SESSION_RECORDERS_LIST.filter(s => cleanUrl.includes(s));
        if (matches.length > 0) {
            eventDataHandler({
                matches,
                stack,
                type: 'SessionRecording',
                url: cleanUrl
            });
        }
    });
};
