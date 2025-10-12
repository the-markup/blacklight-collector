import { Page } from 'puppeteer';
import { BlacklightEvent } from '../types';
import { SESSION_RECORDERS_LIST } from '../helpers/statics';

export const setupSessionRecordingInspector = async (page: Page, eventDataHandler: (event: BlacklightEvent) => void) => {
    page.on('request', async request => {
        const parsedUrl = new URL(request.url());
        const cleanUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        const stack = [{ fileName: request.frame() ? request.frame().url() : '' }];
        
        // check if the request URL matches any known session recording service patterns
        const matches = SESSION_RECORDERS_LIST.filter(session_recorder => cleanUrl.includes(session_recorder));
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
