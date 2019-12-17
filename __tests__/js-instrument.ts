import { Browser, Page, launch } from "puppeteer";
import { Global } from "../src/types";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupBlacklightInspector } from "../src/inspector";
declare var global: Global;
const GETS_AND_SETS = [
  ["prop1", "get", "prop1"],
  ["prop1", "set", "blah1"],
  ["prop1", "get", "blah1"],
  ["prop2", "get", "prop2"],
  ["prop2", "set", "blah2"],
  ["prop2", "get", "blah2"],
  ["objProp", "get", '{"hello":"world"}'],
  ["objProp", "set", '{"key":"value"}'],
  ["objProp", "get", '{"key":"value"}'],
  ["prop3", "get", "default-value"],
  ["prop3", "set", "blah3"],
  ["prop3", "get", "blah3"],
  ["method1", "set", "FUNCTION"],
  ["method1", "set", "now static"],
  ["method1", "get", "now static"],
  ["prop1", "set", "FUNCTION"],
  // The reason I have multiple values for nestedObj is because Jest Set equality tests suck
  [
    "nestedObj",
    "get",
    '{"prop1":"default1","prop2":"default2","method1":"FUNCTION"}'
  ],
  [
    "nestedObj",
    "get",
    '{"prop1":"default1","prop2":"default2","method1":"FUNCTION"}'
  ],
  [
    "nestedObj",
    "get",
    '{"prop1":"default1","prop2":"default2","method1":"FUNCTION"}'
  ],
  [
    "nestedObj",
    "get",
    '{"prop1":"default1","prop2":"default2","method1":"FUNCTION"}'
  ]
];

const METHOD_CALLS = [
  ["method1", "call", ["hello", '{"world":true}']],
  ["method1", "call", ["new argument"]],
  ["prop1", "call", ["now accepting arugments"]]
];

const RECURSIVE_GETS_AND_SETS = [
  ["window.test2.nestedObj.prop1", "get", "default1"],
  ["window.test2.nestedObj.prop1", "set", "updatedprop1"],
  ["window.test2.nestedObj.prop1", "get", "updatedprop1"],
  ["window.test2.nestedObj.prop2", "get", "default2"],
  ["window.test2.nestedObj.method1", "set", "FUNCTION"],
  ["window.test2.nestedObj.doubleNested.prop1", "get", "double default"],
  ["window.test2.nestedObj.doubleNested.prop1", "set", "doubleprop1"],
  ["window.test2.nestedObj.doubleNested.prop1", "get", "doubleprop1"],
  ["window.test2.nestedObj.doubleNested.method1", "set", "FUNCTION"]
];

const RECURSIVE_METHOD_CALLS = [
  ["window.test2.nestedObj.method1", "call", ["arg-before"]],
  ["window.test2.nestedObj.method1", "call", ["arg-after"]],
  ["window.test2.nestedObj.doubleNested.method1", "call", ["blah"]],
  ["window.test2.nestedObj.doubleNested.method1", "call", ["blah"]]
];

const RECURSIVE_PROP_SET = [
  ["window.test2.l1.l2.l3.l4.l5.prop", "get", "level5prop"],
  ["window.test2.l1.l2.l3.l4.l5.l6", "get", '{"prop":"level6prop"}']
];

const SET_PREVENT_CALLS = [
  ["window.test3.method1", "call", []],
  ["window.test3.obj1.method2", "call", []]
];

const SET_PREVENT_GETS_AND_SETS = [
  ["window.test3.prop1", "set", "newprop1"],
  ["window.test3.method1", "set(prevented)", "FUNCTION"],
  ["window.test3.obj1", "set(prevented)", '{"new":"object"}'],
  ["window.test3.obj1.prop2", "set", "newprop2"],
  ["window.test3.obj1.method2", "set(prevented)", "FUNCTION"],
  ["window.test3.obj1.obj2", "set(prevented)", '{"new":"object2"}'],
  ["window.test3.prop1", "get", "newprop1"],
  ["window.test3.obj1.obj2", "get", '{"testobj":"nested"}'],
  ["window.test3.obj1.prop2", "get", "newprop2"]
];

const TOP_URL = `${global.__DEV_SERVER__}/js-instrument/instrument-object.html`;
const FRAME1_URL = `${global.__DEV_SERVER__}/js-instrument/framed1.html`;
const FRAME2_URL = `${global.__DEV_SERVER__}/js-instrument/framed2.html`;

declare var global: Global;
let browser = {} as Browser;

beforeAll(async () => {
  browser = await launch(defaultPuppeteerBrowserOptions);
});

afterAll(async () => {
  await browser.close();
});

/**
 * Helper to check method calls and accesses in each frame
 **/
const checkCalls = (rows, symbol_prefix, top_url) => {
  const observedGetsAndSets = [];
  const observedCalls = [];
  rows.forEach(row => {
    if (!row.data.symbol.startsWith(symbol_prefix)) return;
    const symbol = row.data.symbol.replace(symbol_prefix, "");
    expect(top_url).toBe(TOP_URL);
    if (row.data.operation === "get" || row.data.operation === "set") {
      observedGetsAndSets.push([symbol, row.data.operation, row.data.value]);
    } else {
      observedCalls.push([symbol, row.data.operation, row.data.arguments]);
    }
  });
  expect(observedCalls.sort()).toEqual(METHOD_CALLS.sort());
  expect(observedGetsAndSets.sort()).toEqual(GETS_AND_SETS.sort());
};
describe("JS Instrument", () => {
  it("injects OpenWPM's js instruments into the page", async () => {
    const page = await browser.newPage();
    await setupBlacklightInspector(page, () => {}, true);
    await page.goto(TOP_URL);
    expect(await page.evaluate(() => (window as any).reportEvent)).toBeTruthy();
    expect(
      await page.evaluate(() => (window as any).instrumentFunctionViaProxy)
    ).toBeTruthy();
    expect(
      await page.evaluate(() => (window as any).instrumentObjectProperty)
    ).toBeTruthy();
    expect(
      await page.evaluate(() => (window as any).instrumentObject)
    ).toBeTruthy();
    await page.close();
  });
  it("can pass OpenWPM tests for JS instrumentation", async () => {
    const page = await browser.newPage();
    const rows = [];
    const eventDataHandler = event => rows.push(event);
    await setupBlacklightInspector(page, eventDataHandler, true, []);
    await page.goto(TOP_URL, {
      waitUntil: "networkidle0"
    });

    // Check calls of non-recursive instrumentation
    // console.log(rows);
    checkCalls(rows, "window.test.", TOP_URL);
    checkCalls(rows, "window.frame1Test.", TOP_URL);
    checkCalls(rows, "window.frame2Test.", TOP_URL);
    // // Check calls of recursive instrumentation
    let observedGetsAndSets = [];
    let observedCalls = [];
    rows.forEach(row => {
      if (!row.data.symbol.startsWith("window.test2.nestedObj")) return;
      expect(row["url"]).toBe(TOP_URL);

      if (row.data.operation === "get" || row.data.operation === "set") {
        observedGetsAndSets.push([
          row.data["symbol"],
          row.data["operation"],
          row.data["value"]
        ]);
      } else {
        observedCalls.push([
          row.data["symbol"],
          row.data["operation"],
          row.data["arguments"]
        ]);
      }
    });
    expect(observedCalls.sort()).toEqual(RECURSIVE_METHOD_CALLS.sort());
    expect(observedGetsAndSets.sort()).toEqual(RECURSIVE_GETS_AND_SETS.sort());

    // // Check that calls not present after default recursion limit (5)
    // // We should only see the window.test2.l1.l2.l3.l4.l5.prop access
    // // and not window.test2.l1.l2.l3.l4.l5.l6.prop access.
    let propAccess = [];
    rows.forEach(row => {
      if (!row.data["symbol"].startsWith("window.test2.l1")) return;

      expect(row["url"]).toBe(TOP_URL);
      propAccess.push([
        row.data["symbol"],
        row.data["operation"],
        row.data["value"]
      ]);
    });
    expect(propAccess.sort()).toEqual(RECURSIVE_PROP_SET.sort());

    // // Check calls of object with sets prevented
    observedGetsAndSets = [];
    observedCalls = [];
    rows.forEach(row => {
      if (!row.data["symbol"].startsWith("window.test3")) return;
      expect(row["url"]).toBe(TOP_URL);
      if (row.data["operation"] == "call") {
        observedCalls.push([
          row.data["symbol"],
          row.data["operation"],
          row.data["arguments"]
        ]);
      } else {
        observedGetsAndSets.push([
          row.data["symbol"],
          row.data["operation"],
          row.data["value"]
        ]);
      }
    });
    expect(observedCalls.sort()).toEqual(SET_PREVENT_CALLS.sort());
    expect(observedGetsAndSets.sort()).toEqual(
      SET_PREVENT_GETS_AND_SETS.sort()
    );
    // await page.close();
  });
});
