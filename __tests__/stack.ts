import puppeteer from "puppeteer";

import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { Global, BlacklightEvent } from "../src/types";
import { setupBlacklightInspector } from "../src/inspectors/inspector";
import { getDomain } from "tldts";
import { getStackType, getScriptUrl } from "../src/utils";
declare var global: Global;

const JS_STACK_TEST_SCRIPT_URL = `${global.__DEV_SERVER__}/stack.js`;
const JS_STACK_TEST_URL = `${global.__DEV_SERVER__}/js-call-stack.html`;

const JS_STACK_CALLS = [
  [JS_STACK_TEST_URL, "eval", "window.navigator.appName", "get"],
  [JS_STACK_TEST_URL, "eval", "window.navigator.appCodeName", "get"],
  [JS_STACK_TEST_URL, "check_navigator", "window.navigator.userAgent", "get"],
  [JS_STACK_TEST_SCRIPT_URL, "eval", "window.navigator.vendor", "get"],
  [JS_STACK_TEST_SCRIPT_URL, "eval", "window.navigator.appVersion", "get"],
  [
    JS_STACK_TEST_SCRIPT_URL,
    "js_check_navigator",
    "window.navigator.userAgent",
    "get"
  ],
  [JS_STACK_TEST_SCRIPT_URL, "eval", "window.navigator.platform", "get"]
];

it("can correctly parse the stack trace", async () => {
  const browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
  const page = (await browser.pages())[0];
  const rows: BlacklightEvent[] = [];
  const url = JS_STACK_TEST_URL;
  await setupBlacklightInspector(page, e => rows.push(e));
  await page.goto(url);
  await browser.close();
  let output = [];
  rows.forEach(e => {
    const data = <JsInstrumentData>e.data;
    output.push([
      getScriptUrl(e),
      e.stack[1].functionName,
      data.symbol,
      data.operation
    ]);
  });
  expect(output.sort()).toEqual(JS_STACK_CALLS.sort());
});
// it("can go through the stacktrace and find and see if there were third-party calls", async () => {
//   const browser = await launch(defaultPuppeteerBrowserOptions);
//   const page = (await browser.pages())[0];
//   const rows = [];
//   await setupBlacklightInspector(page, e => rows.push(e));
//   //   await page.goto(`${global.__DEV_SERVER__}/simple.html`);
//   const url =JS_STACK_TEST_URL;
//   const domain = getDomain(url);
//   await page.goto(url);
//   await browser.close();
//   console.time();
//   rows.forEach(element => {
//     // if (!element.data.symbol.includes("addEvent")) return;
//     const stackType = getStackType(element.stack, domain);
//     console.log(stackType);
//     console.log(element.stack);
//     // let hasFirstParty = false;
//     // let hasThirdParty = false;
//     // element.stack.forEach(s => {
//     //   if (s.hasOwnProperty("fileName")) {
//     //     const scriptDomain = getDomain(s.fileName);
//     //     if (scriptDomain === domain) {
//     //       hasFirstParty = true;
//     //     } else {
//     //       hasThirdParty = true;
//     //     }
//     //   }
//     // });
//     // if (hasFirstParty && hasThirdParty) {
//     //   console.log(element.stack);
//     // }
// //   });
//   console.timeEnd();
//   //   console.log([].concat(rows.map(m => m.stack)));
//   //   flatMap(rows.map(m => m.stach));
// });
