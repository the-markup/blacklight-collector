// import { launchBrowser } from "../../src";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { fillForms } from "../src/pptr-utils/interaction-utils";
import { Browser, launch } from "puppeteer";
import { setupDataExfiltrationInspector } from "../src/data-exfiltration";
import { Global } from "../src/types";
declare var global: Global;
const INPUT_VALUES_RESULT = [
  { type: "email", value: "blacklight-headless@themarkup.org", name: "email" },
  {
    type: "text",
    value: "IdaTarbell",
    name: "username"
  },
  { type: "password", value: "SUPERSECRETP@SSW0RD", name: "" },
  {
    type: "text",
    value: "IdaTarbell",
    name: "test"
  },
  { type: "submit", value: "Submit", name: "" }
];

const INPUT_AUTOCOMPLETE_RESULT = [
  { type: "text", value: "IdaTarbell", name: "name" },
  { type: "email", value: "blacklight-headless@themarkup.org", name: "email" },
  { type: "email", value: "blacklight-headless@themarkup.org", name: "emailC" },
  { type: "tel", value: "+19172506774", name: "phone" },
  { type: "text", value: "1337 Broadway", name: "ship-address" },
  { type: "text", value: "New York City", name: "ship-city" },
  { type: "text", value: "NY", name: "ship-state" },
  { type: "text", value: "10011", name: "ship-zip" },
  { type: "text", value: "USA", name: "ship-country" },
  { type: "checkbox", value: "on", name: "billAndShip" },
  { type: "text", value: "IdaTarbell", name: "maiden-name" },
  { type: "text", value: "IdaTarbell", name: "ssn" },
  { type: "date", value: "", name: "birthday" },
  { type: "text", value: "IdaTarbell", name: "username" },
  { type: "password", value: "SUPERSECRETP@SSW0RD", name: "password" },
  { type: "text", value: "IdaTarbell", name: "website" },
  { type: "text", value: "IDATARBELL", name: "ccname" },
  { type: "text", value: "1234123412341234", name: "cardnumber" },
  { type: "text", value: "123", name: "cvc" },
  { type: "text", value: "01/2022", name: "cc-exp" }
];
jest.setTimeout(10000);
const DATA_EXFILTRATION = [
  {
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html",
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    data: {
      post_request_url: "http://localhost:8125/bogus_submit.html",
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkup.orgtest@example.com","isChecked":false,"id":21}}}',
      base_64: false,
      filter: ["blacklight-headless@themarkup.org"]
    }
  },
  {
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html",
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    data: {
      post_request_url: "http://localhost:8125/bogus_submit.html",
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwLm9yZ3Rlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      base_64: true,
      filter: ["blacklight-headless@themarkup.org"]
    }
  },
  {
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html",
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    data: {
      post_request_url: "http://localhost:8125/bogus_submit.html",
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbell","isChecked":false,"id":24}}}',
      base_64: false,
      filter: ["IdaTarbell"]
    }
  },
  {
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html",
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    data: {
      post_request_url: "http://localhost:8125/bogus_submit.html",
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbGwiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==",
      base_64: true,
      filter: ["IdaTarbell"]
    }
  },
  {
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html",
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    data: {
      post_request_url: "http://localhost:8125/bogus_submit.html",
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbell","isChecked":false,"id":27}}}',
      base_64: false,
      filter: ["IdaTarbell"]
    }
  },
  {
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html",
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    data: {
      post_request_url: "http://localhost:8125/bogus_submit.html",
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbGwiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==",
      base_64: true,
      filter: ["IdaTarbell"]
    }
  }
];
let browser = {} as Browser;
beforeAll(async () => {
  browser = await launch({
    ...defaultPuppeteerBrowserOptions,
    headless: true
  });
});

afterAll(async () => {
  await browser.close();
});
describe("DataExfiltration", () => {
  it("can fill input fields", async () => {
    const page = await browser.newPage();
    const testUrl = `${global.__DEV_SERVER__}/post_request.html`;
    await page.goto(testUrl);
    await fillForms(page);
    const inputValues: any = await page.evaluate(async () => {
      return new Promise((res, rej) => {
        function getInputs() {
          return Array.from(document.getElementsByTagName("input")).map(el => ({
            type: el.type || "",
            value: el.value || "",
            name: el.name || ""
          }));
        }
        res(getInputs());
      });
    });
    expect(inputValues.sort()).toEqual(INPUT_VALUES_RESULT.sort());
    await page.close();
  });

  it("can fill input autocomplete fields", async () => {
    const page = await browser.newPage();
    const testUrl = `${global.__DEV_SERVER__}/input-form.html`;
    await page.goto(testUrl, { timeout: 10000 });
    await fillForms(page);
    await page.waitFor(2000);

    const inputValues: any = await page.evaluate(async () => {
      return new Promise((res, rej) => {
        function getInputs() {
          return Array.from(document.getElementsByTagName("input")).map(el => ({
            type: el.type || "",
            value: el.value || "",
            name: el.name || ""
          }));
        }
        res(getInputs());
      });
    });
    expect(inputValues.sort()).toEqual(INPUT_AUTOCOMPLETE_RESULT.sort());
    await page.close();
  });

  it("can observe network requests and check for data that matches input that was typed on the page ", async () => {
    const page = await browser.newPage();
    const testUrl = `${global.__DEV_SERVER__}/session_recorder.html`;
    // const testUrl = "https://www.veteransunited.com/";
    const rows = [];
    const eventHandler = event => {
      rows.push(event);
    };
    await setupDataExfiltrationInspector(page, eventHandler);
    await page.goto(testUrl, { waitUntil: "networkidle2" });
    await page.waitFor(1000);
    await fillForms(page);
    await page.waitFor(100);
    await page.close();
    expect(rows.filter(r => r.type === "DataExfiltration").sort()).toEqual(
      DATA_EXFILTRATION.sort()
    );
  });
});
