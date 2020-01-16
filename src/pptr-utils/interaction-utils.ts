import { Page } from "puppeteer";
export const DEFAULT_INPUT_VALUES = {
  date: "11/01/2019",
  email: "blacklight@themarkup.org",
  password: "SUPERSECRETP@SSW0RD",
  search: "TheMarkup",
  tel: "2121112222",
  text: "IdaTarbell",
  url: "https://themarkup.org"
};

export const fillForms = async (
  page: Page,
  inputText = DEFAULT_INPUT_VALUES
) => {
  const elements = await page.$$("input");
  const count = 0;
  for (const el of elements) {
    try {
      if (count > 100) {
        break;
      }
      const pHandle = await el.getProperty("type");
      const pValue = await pHandle.jsonValue();

      if (pValue === "submit" || pValue === "hidden") {
        continue;
      } else if (Object.keys(inputText).includes(pValue as string)) {
        await el.focus();
        await page.keyboard.press("Tab", {
          delay: 100
        });
        await el.press("Backspace");
        await page.keyboard.type(inputText[pValue as string]);
      }
      await page.waitFor(100);
    } catch (error) {
      console.error(error);
    }
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
