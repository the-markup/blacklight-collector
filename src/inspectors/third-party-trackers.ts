import { fromPuppeteerDetails, PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import fs from 'fs';
import path from 'path';
import { Page } from 'puppeteer';
import { TrackingRequestEvent } from '../types';

/**
 * @fileoverview
 * @see https://github.com/EU-EDPS/website-evidence-collector/blob/f75ef3ea7ff1be24940c4c33218c900afcf31979/lib/setup-beacon-recording.js
 */

const blockerOptions = {
    debug: true,
    enableOptimizations: false, 
    loadCosmeticFilters: false 
};

const blockers = {
    'easyprivacy.txt': PuppeteerBlocker.parse(fs.readFileSync(path.join(__dirname, '../../data/blocklists/easyprivacy.txt'), 'utf8'), blockerOptions),
    'easylist.txt': PuppeteerBlocker.parse(fs.readFileSync(path.join(__dirname, '../../data/blocklists/easylist.txt'), 'utf8'), blockerOptions)
};

export const setUpThirdPartyTrackersInspector = async (
    page: Page,
    eventDataHandler: (event: TrackingRequestEvent) => void,
    enableAdBlock = false
) => {
    if (enableAdBlock) {
        await page.setRequestInterception(true);
    }

    page.on('request', async request => {
        let isBlocked = false;

        for (const [listName, blocker] of Object.entries(blockers)) {
            // if any request match the third party rules
            const { match, filter } = blocker.match(fromPuppeteerDetails(request));

            if (!match) {
                continue;
            }

            isBlocked = true;

            //handle get methods requests
            const params = new URL(request.url()).searchParams;
            const query = {};
            for (const [key, value] of params.entries()) {
                try {
                    query[key] = JSON.parse(value);
                } catch {
                    query[key] = value;
                }
            }

            //handle post methods requests
            let body = {}
            const postData = request.postData();
            if (postData) {
                try {
                    body = JSON.parse(postData);
                } catch {
                    body = postData;
                }
            }

            eventDataHandler({
                data: {
                    query, 
                    body,
                    filter: filter.toString(), 
                    listName 
                },
                stack: [
                    {
                        fileName: request.frame()?.url() ?? '',
                        source: 'ThirdPartyTracker RequestHandler'
                    }
                ],
                type: 'TrackingRequest',
                url: request.url()
            });

            break;
        }

        if (enableAdBlock) {
            if (isBlocked) {
                request.abort();
            } else {
                request.continue();
            }
        }
    });
};

