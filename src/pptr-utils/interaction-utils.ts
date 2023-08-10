import { Page } from 'puppeteer';

export const DEFAULT_INPUT_VALUES = {
    date: '01/01/2026',
    email: 'blacklight-headless@themarkup.org',
    password: 'SUPERS3CR3T_PASSWORD',
    search: 'TheMarkup',
    text: 'IdaaaaTarbell',
    url: 'https://themarkup.org',
    organization: 'The Markup',
    'organization-title': 'Non-profit newsroom',
    'current-password': 'S3CR3T_CURRENT_PASSWORD',
    'new-password': 'S3CR3T_NEW_PASSWORD',
    username: 'idaaaa_tarbell',
    'family-name': 'Tarbell',
    'given-name': 'Idaaaa',
    name: 'IdaaaaTarbell',
    'street-address': 'PO Box #1103',
    'address-line1': 'PO Box #1103',
    'postal-code': '10159',
    'cc-name': 'IDAAAATARBELL',
    'cc-given-name': 'IDAAAA',
    'cc-family-name': 'TARBELL',
    'cc-number': '4479846060020724',
    'cc-exp': '01/2026', // "MM/YY" or "MM/YYYY".
    'cc-type': 'Visa',
    'transaction-amount': '13371337',
    bday: '01-01-1970',
    sex: 'Female',
    tel: '+1971112233',
    'tel-national': '917-111-2233',
    impp: 'xmpp:blacklight-headless@themarkup.org'
};

export const fillForms = async (page: Page) => {
    try {
        console.log('Checking for inputs on the page');
        const elements = await page.$$('input');
        console.log(`Found ${elements.length} input elements`);
        let count = 0;
        for (const el of elements) {
            console.log(`Inspecting element ${count}`);
            if (count > 100) {
                break;
            }
            const pHandle = await el.getProperty('type');
            const pValue = await pHandle.jsonValue();
            console.log(`Input is type ${pValue}`);

            const autoCompleteHandle = await el.getProperty('autocomplete');
            const autoCompleteValue = (await autoCompleteHandle.jsonValue()) as string;
            console.log(`Autocomplete attribute is: ${autoCompleteValue}`);
            let autoCompleteKeys = [];

            console.log('Checking autocomplete value');
            if (autoCompleteValue) {
                if (autoCompleteValue.includes('cc-name')) {
                    console.log('Autocomplete includes cc-name.');
                    autoCompleteKeys = ['cc-name'];
                } else {
                    console.log('Autocomplete does not include cc-name.');
                    autoCompleteKeys = Object.keys(DEFAULT_INPUT_VALUES).filter(k => (autoCompleteValue as string).includes(k));
                }
            }

            if (pValue === 'submit' || pValue === 'hidden') {
                console.log('Type is either submit or hidden.');
                continue;
            } else if (autoCompleteKeys.length > 0) {
                console.log('Autocomplete keys > 0');
                await el.focus();
                await page.keyboard.press('Tab', {
                    delay: 100
                });
                await el.press('Backspace');
                await page.keyboard.type(DEFAULT_INPUT_VALUES[autoCompleteKeys[0] as string]);
            } else if (Object.keys(DEFAULT_INPUT_VALUES).includes(pValue as string)) {
                console.log('Default input values includes pValue');
                await el.focus();
                await page.keyboard.press('Tab', {
                    delay: 100
                });
                await el.press('Backspace');
                await page.keyboard.type(DEFAULT_INPUT_VALUES[pValue as string]);
                console.log(' ... done with test');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log(' .... done');
            count += 1;
        }
    } catch (error) {
        console.log(error);
    }
};
export const autoScroll = async page => {
    await page.evaluate(async () => {
        return new Promise((resolve, reject) => {
            try {
                let totalHeight = 0;
                const distance = 150;
                const COUNT_MAX = 5;
                let count = 0;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    count += 1;
                    if (totalHeight >= scrollHeight || count > COUNT_MAX) {
                        clearInterval(timer);
                        resolve(undefined);
                    }
                }, 100);
            } catch (error) {
                reject(error);
            }
        });
    });
};
