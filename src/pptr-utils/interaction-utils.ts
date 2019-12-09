import { Page } from "puppeteer";
export const DEFAULT_INPUT_VALUES = {
  email: "blacklight@themarkup.org",
  date: "11/01/2019",
  password: "SUPERSECRETP@SSW0RD",
  tel: "2121112222",
  search: "TheMarkup",
  text: "IdaTarbell",
  url: "https://themarkup.org"
};

export const fillForms = async (
  page: Page,
  inputText = DEFAULT_INPUT_VALUES
) => {
  const elements = await page.$$("input");
  let count = 0;
  for (const el of elements) {
    try {
      if (count > 100) {
        break;
      }
      const pHandle = await el.getProperty("type");
      const pValue = await pHandle.jsonValue();

      if (pValue === "submit" || pValue === "hidden") {
        continue;
      } else if (Object.keys(inputText).includes(<string>pValue)) {
        await el.focus();
        await page.keyboard.press("Tab", {
          delay: 100
        });
        await el.press("Backspace");
        await page.keyboard.type(inputText[<string>pValue]);
      }
      await page.waitFor(100);
    } catch (error) {
      console.log(error);
    }
  }
};
export const autoScroll = async function(page) {
  await page.evaluate(async () => {
    return new Promise((resolve, reject) => {
      try {
        var totalHeight = 0;
        var distance = 150;
        var COUNT_MAX = 5;
        var count = 0;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
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
