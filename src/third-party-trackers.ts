import { fromPuppeteerDetails, PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import fs from 'fs';
import path from 'path';
import { Page } from 'puppeteer';
import { TrackingRequestEvent } from './types';

/**
 * @fileoverview
 * @see https://github.com/EU-EDPS/website-evidence-collector/blob/master/lib/setup-beacon-recording.js
 */

const blockerOptions = {
    debug: true, // Keep track of the rule that matched a request
    enableOptimizations: false, // Required to return all information about block rule
    loadCosmeticFilters: false // We're only interested in network filters
};

const blockers = {
    'easyprivacy.txt': PuppeteerBlocker.parse(fs.readFileSync(path.join(__dirname, '../data/blocklists/easyprivacy.txt'), 'utf8'), blockerOptions),
    'easylist.txt': PuppeteerBlocker.parse(fs.readFileSync(path.join(__dirname, '../data/blocklists/easylist.txt'), 'utf8'), blockerOptions)
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
            const { match, filter } = blocker.match(fromPuppeteerDetails(request));

            if (!match) {
                continue;
            }

            isBlocked = true;

            const query = new URL(request.url()).searchParams;
            for (const param in query) {
                try {
                    query[param] = JSON.parse(query[param]);
                } catch {}
            }

            eventDataHandler({
                data: {
                    query,
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
