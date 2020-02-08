import { Page } from "puppeteer";

// tslint:disable:object-literal-sort-keys
export const DEFAULT_AUTOCOMPLETE_VALUES = {
  organization: "The Markup",
  "organization-title": "Investigative Data Journalist",
  "current-password": "S3CR3T_CURRENT_PASSWORD",
  "new-password": "S3CR3T_NEW_PASSWORD",
  username: "ida_tarbell",
  "family-name": "Tarbell",
  "given-name": "Ida",
  name: "IdaTarbell",
  email: "blacklight-headless@themarkup.org",
  "street-address": "1337 Broadway",
  "address-line1": "Apt 33",
  // "address-level1": "NY",
  // "address-level2": "New York City",
  // "address-level3": "New York City",
  // "address-level4": "New York City",
  "postal-code": "10011",
  // country: "USA",
  // "country-name": "United States",
  "cc-name": "IDATARBELL",
  "cc-given-name": "IDA",
  "cc-family-name": "TARBELL",
  "cc-number": "4242424242424242",
  // "cc-csc": "123",
  "cc-exp": "01/2022", // "MM/YY" or "MM/YYYY".
  // "cc-exp-month": "01",
  // "cc-exp-year": "2019",
  "cc-type": "Visa",
  "transaction-currency": "USD",
  "transaction-amount": "13371337",
  bday: "01-01-1970",
  // "bday-day": "01",
  // "bday-month": "01",
  // "bday-year": "1970",
  sex: "Female",
  tel: "+1971112233",
  // "tel-country-code": "1",
  "tel-national": "917-111-2233",
  // "tel-area-code": "123",
  // "tel-local": "111-2222",
  // "tel-local-prefix": "111",
  // "tel-local-suffix": "111",
  url: "https://themarkup.org",
  impp: "xmpp:blacklight-headless@themarkup.org"
};
export const DEFAULT_INPUT_VALUES = {
  date: "01/01/2020",
  email: "blacklight-headless@themarkup.org",
  password: "SUPERSECRETP@SSW0RD",
  search: "TheMarkup",
  tel: "9171112233",
  text: "IdaTarbell",
  url: "https://themarkup.org"
};

export const fillForms = async (page: Page) => {
  try {
    const elements = await page.$$("input");
    const count = 0;
    for (const el of elements) {
      if (count > 100) {
        break;
      }
      const pHandle = await el.getProperty("type");
      const pValue = await pHandle.jsonValue();

      const autoCompleteHandle = await el.getProperty("autocomplete");
      const autoCompleteValue = (await autoCompleteHandle.jsonValue()) as string;
      let autoCompleteKeys = [];

      if (autoCompleteValue) {
        if (autoCompleteValue.includes("cc-name")) {
          autoCompleteKeys = ["cc-name"];
        } else {
          autoCompleteKeys = Object.keys(
            DEFAULT_AUTOCOMPLETE_VALUES
          ).filter(k => (autoCompleteValue as string).includes(k));
        }
      }

      if (pValue === "submit" || pValue === "hidden") {
        continue;
      } else if (autoCompleteKeys.length > 0) {
        await el.focus();
        await page.keyboard.press("Tab", {
          delay: 100
        });
        await el.press("Backspace");
        await page.keyboard.type(
          DEFAULT_AUTOCOMPLETE_VALUES[autoCompleteKeys[0] as string]
        );
      } else if (Object.keys(DEFAULT_INPUT_VALUES).includes(pValue as string)) {
        await el.focus();
        await page.keyboard.press("Tab", {
          delay: 100
        });
        await el.press("Backspace");
        await page.keyboard.type(DEFAULT_INPUT_VALUES[pValue as string]);
      }
      await page.waitFor(100);
    }
  } catch (error) {
    console.error(error);
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
            resolve();
          }
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  });
};
