import { Page } from 'puppeteer';
import { DEFAULT_INPUT_VALUES } from './pptr-utils/interaction-utils';
import { BlacklightErrorEvent, KeyLoggingEvent } from './types';
import { getHashedArray } from './utils';

const INPUT_VALUES = Object.values(DEFAULT_INPUT_VALUES);

const hashesMap: Record<string, string[]> = {
    plaintext: INPUT_VALUES,
    base64: getHashedArray('base64', INPUT_VALUES),
    md5: getHashedArray('md5', INPUT_VALUES),
    sha256: getHashedArray('sha256', INPUT_VALUES),
    sha512: getHashedArray('sha512', INPUT_VALUES)
};

export async function setUpKeyLoggingInspector(
    page: Page,
    eventDataHandler: (event: KeyLoggingEvent|BlacklightErrorEvent) => void
) {
    page.on('request', request => {
        const stack = [
            {
                fileName: request.frame() ? request.frame().url() : '',
                source: 'RequestHandler'
            }
        ];

        if (request.method() === 'POST') {
            try {
                let matchTypes = new Set<string>();
                let filter: string[] = [];

                for (const hashType in hashesMap) {
                    const hashedValues = hashesMap[hashType];

                    for (const value of hashedValues) {
                        if (request.postData()?.includes(value)) {
                            filter.push(value);
                            matchTypes.add(hashType);
                            break;
                        }
                    }
                }

                eventDataHandler({
                    data: {
                        filter,
                        match_type: Array.from(matchTypes),
                        post_data: request.postData(),
                        post_request_url: request.url()
                    },
                    stack,
                    type: 'KeyLogging',
                    url: request.frame().url()
                });
            } catch (error) {
                console.error(error);
                eventDataHandler({
                    data: {
                        message: JSON.stringify(error)
                    },
                    stack,
                    type: 'Error.KeyLogging',
                    url: request.frame().url()
                });
            }
        }
    });
};
