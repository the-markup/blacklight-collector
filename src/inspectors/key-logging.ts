import { HTTPRequest, Page } from 'puppeteer';
import { DEFAULT_INPUT_VALUES } from '../pptr-utils/interaction-utils';
import { BlacklightEvent } from '../types';
import { getHashedValues } from '../utils';

const ts = [
    ...Object.values(DEFAULT_INPUT_VALUES),
    ...Object.values(getHashedValues('base64', DEFAULT_INPUT_VALUES)),
    ...Object.values(getHashedValues('md5', DEFAULT_INPUT_VALUES)),
    ...Object.values(getHashedValues('sha256', DEFAULT_INPUT_VALUES)),
    ...Object.values(getHashedValues('sha512', DEFAULT_INPUT_VALUES))
];

const hashesMap = {
    base64: Object.values(getHashedValues('base64', DEFAULT_INPUT_VALUES)),
    md5: Object.values(getHashedValues('md5', DEFAULT_INPUT_VALUES)),
    plaintext: Object.values(DEFAULT_INPUT_VALUES),
    sha256: Object.values(getHashedValues('sha256', DEFAULT_INPUT_VALUES)),
    sha512: Object.values(getHashedValues('sha512', DEFAULT_INPUT_VALUES))
};

export const setupKeyLoggingInspector = async (page: Page, eventDataHandler: (event: BlacklightEvent) => void) => {
    page.on('request', (request: HTTPRequest) => {
        const stack = [
            {
                fileName: request.frame() ? request.frame().url() : '',
                source: `RequestHandler`
            }
        ];
        if (request.method() === 'POST') {
            try {
                let filter = [];
                filter = ts.filter((t: string) => request.postData().indexOf(t) > -1);
                if (filter.length > 0) {
                    let match_type = [];
                    filter.forEach(val => {
                        const m = Object.entries(hashesMap).filter(([, hashes]) => {
                            return hashes.indexOf(val) > -1;
                        });
                        match_type = match_type.concat(m.map(e => e[0]));
                    });
                    match_type = [...new Set(match_type)];
                    eventDataHandler({
                        data: {
                            filter,
                            match_type,
                            post_data: request.postData(),
                            post_request_url: request.url()
                        },
                        stack,
                        type: `KeyLogging`,
                        url: request.frame().url()
                    });
                }
            } catch (error) {
                eventDataHandler({
                    data: {
                        message: JSON.stringify(error)
                    },
                    stack,
                    type: `Error.KeyLogging`,
                    url: request.frame().url()
                });
            }
        }
    });
};
