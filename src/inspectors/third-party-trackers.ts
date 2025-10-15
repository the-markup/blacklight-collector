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
    debug: true, // Keep track of the rule that matched a request
    enableOptimizations: false, // Required to return all information about block rule
    loadCosmeticFilters: false // We're only interested in network filters
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
            const postData = request.postData();
            if (postData) {
            
            try {
                const payload = JSON.parse(postData);
                const extracted = flattenJson(payload);
                Object.assign(query, extracted); // merge into query
            } catch {
                query["raw_post"] = postData;// fallback
              }
            }

            eventDataHandler({
                data: {
                    query, // url parameters in dictionary format
                    filter: filter.toString(), // the match request for request
                    listName // list name the filter belong to
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




export function flattenJson(obj: any, parentKey = '', result: Record<string, any> = {}): Record<string, any> {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}_${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenJson(value, newKey, result);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === 'object') {
          flattenJson(item, `${newKey}_${index}`, result);
        } else {
          result[`${newKey}_${index}`] = item;
        }
      });
    } else {
      result[newKey] = value;
    }
  }
  return result;
}