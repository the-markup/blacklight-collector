// import { launchBrowser } from "../../src";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { fillForms } from "../src/pptr-utils/interaction-utils";
import puppeteer, { Browser } from "puppeteer";
import { setupKeyLoggingInspector } from "../src/key-logging";
import { Global } from "../src/types";

declare var global: Global;

const INPUT_VALUES_RESULT = [
  { type: "email", value: "blacklight-headless@themarkup.org", name: "email" },
  {
    type: "text",
    value: "IdaaaaTarbell",
    name: "username"
  },
  { type: "password", value: "SUPERS3CR3T_PASSWORD", name: "" },
  {
    type: "text",
    value: "IdaaaaTarbell",
    name: "test"
  },
  { type: "submit", value: "Submit", name: "" }
];
const AUTOCOMPLETE_VALUES_RESULT = [
  { type: "text", value: "IdaaaaTarbell", name: "name" },
  { type: "email", value: "blacklight-headless@themarkup.org", name: "email" },
  { type: "email", value: "blacklight-headless@themarkup.org", name: "emailC" },
  { type: "tel", value: "+1971112233", name: "phone" },
  { type: "text", value: "PO Box #1103", name: "ship-address" },
  { type: "text", value: "IdaaaaTarbell", name: "ship-city" },
  { type: "text", value: "IdaaaaTarbell", name: "ship-state" },
  { type: "text", value: "10159", name: "ship-zip" },
  { type: "text", value: "IdaaaaTarbell", name: "ship-country" },
  { type: "checkbox", value: "on", name: "billAndShip" },
  { type: "text", value: "IdaaaaTarbell", name: "maiden-name" },
  { type: "text", value: "IdaaaaTarbell", name: "ssn" },
  { type: "date", value: "", name: "birthday" },
  { type: "text", value: "IdaaaaTarbell", name: "username" },
  { type: "password", value: "SUPERS3CR3T_PASSWORD", name: "password" },
  { type: "text", value: "IdaaaaTarbell", name: "website" },
  { type: "text", value: "IDAAAATARBELL", name: "ccname" },
  { type: "text", value: "4479846060020724", name: "cardnumber" },
  { type: "text", value: "IdaaaaTarbell", name: "cvc" },
  { type: "text", value: "01/2026", name: "cc-exp" }
];
jest.setTimeout(10000);
const DATA_EXFILTRATION_BASE64 = [
  {
    data: {
      filter: ["blacklight-headless@themarkup.org"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkup.orgtest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["YmxhY2tsaWdodC1oZWFkbGVzc0B0aGVtYXJrdXAub3Jn"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"YmxhY2tsaWdodC1oZWFkbGVzc0B0aGVtYXJrdXAub3JndGVzdEBleGFtcGxlLmNvbQ==","isChecked":false,"id":21}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"Idaaaa","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFh","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaT","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVA==","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTa","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGE=","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTar","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFy","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarb","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYg==","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarbe","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYmU=","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarbel","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYmVs","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["IdaaaaTarbell", "Tarbell", "Idaaaa", "IdaaaaTarbell"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarbell","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: [
        "SWRhYWFhVGFyYmVsbA==",
        "VGFyYmVsbA==",
        "SWRhYWFh",
        "SWRhYWFhVGFyYmVsbA=="
      ],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYmVsbA==","isChecked":false,"id":24}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"Idaaaa","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFh","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaT","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVA==","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTa","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGE=","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTar","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFy","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarb","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYg==","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarbe","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYmU=","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["Idaaaa"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarbel","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["SWRhYWFh"],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYmVs","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: ["IdaaaaTarbell", "Tarbell", "Idaaaa", "IdaaaaTarbell"],
      match_type: ["plaintext"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaaaaTarbell","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      filter: [
        "SWRhYWFhVGFyYmVsbA==",
        "VGFyYmVsbA==",
        "SWRhYWFh",
        "SWRhYWFhVGFyYmVsbA=="
      ],
      match_type: ["base64"],
      post_data:
        '{"type":3,"data":{"source":5,"text":"SWRhYWFhVGFyYmVsbA==","isChecked":false,"id":27}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "KeyLogging",
    url: "http://localhost:8125/session_recorder.html"
  }
];
let browser = {} as Browser;
beforeAll(async () => {
  browser = await puppeteer.launch({
    ...defaultPuppeteerBrowserOptions,
    headless: true
  });
});

afterAll(async () => {
  await browser.close();
});
describe("KeyLogging", () => {
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
    await page.waitForTimeout(2000);

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
    expect(inputValues.sort()).toEqual(AUTOCOMPLETE_VALUES_RESULT.sort());
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

    await setupKeyLoggingInspector(page, eventHandler);
    await page.goto(testUrl, { waitUntil: "networkidle2" });
    await page.waitForTimeout(1000);
    await fillForms(page);
    await page.waitForTimeout(100);
    await page.close();
    // console.log(rows);
    expect(rows.filter(r => r.type === "KeyLogging").sort()).toEqual(
      DATA_EXFILTRATION_BASE64.sort()
    );
  });
  const DATA_EXFILTRATION_MIXED = [
    {
      data: {
        filter: [
          "4a0011aafd770c509415a408de9171ecb29c6c76879596eb557f4c2984af7280"
        ],
        match_type: ["sha256"],
        post_data:
          "data=4a0011aafd770c509415a408de9171ecb29c6c76879596eb557f4c2984af7280",
        post_request_url: "http://localhost:8125/bogus_submit.html"
      },
      stack: [
        {
          fileName: "http://localhost:8125/key-logging-hashing-test.html",
          source: "RequestHandler"
        }
      ],
      type: "KeyLogging",
      url: "http://localhost:8125/key-logging-hashing-test.html"
    },
    {
      data: {
        filter: [
          "ce733cd2ef646659f025e759abb1ee7679076d9586de45d1a27ecc6cfa0f9940b7216f331657397890292b13d5823a4c1cbd57eb8d7f7966bd99d6bdea7d25b4"
        ],
        match_type: ["sha512"],
        post_data:
          "data=ce733cd2ef646659f025e759abb1ee7679076d9586de45d1a27ecc6cfa0f9940b7216f331657397890292b13d5823a4c1cbd57eb8d7f7966bd99d6bdea7d25b4",
        post_request_url: "http://localhost:8125/bogus_submit.html"
      },
      stack: [
        {
          fileName: "http://localhost:8125/key-logging-hashing-test.html",
          source: "RequestHandler"
        }
      ],
      type: "KeyLogging",
      url: "http://localhost:8125/key-logging-hashing-test.html"
    },
    {
      data: {
        filter: [
          "32d0d3a010782669bd974d6e64c6fdaf",
          "32d0d3a010782669bd974d6e64c6fdaf"
        ],
        match_type: ["md5"],
        post_data: "data=32d0d3a010782669bd974d6e64c6fdaf",
        post_request_url: "http://localhost:8125/bogus_submit.html"
      },
      stack: [
        {
          fileName: "http://localhost:8125/key-logging-hashing-test.html",
          source: "RequestHandler"
        }
      ],
      type: "KeyLogging",
      url: "http://localhost:8125/key-logging-hashing-test.html"
    }
  ];
  it("can match hashed versions (base64, md5, sha256, sha512) of the input text", async () => {
    const page = await browser.newPage();
    const testUrl = `${global.__DEV_SERVER__}/key-logging-hashing-test.html`;
    const rows = [];
    const eventHandler = event => {
      rows.push(event);
    };
    await setupKeyLoggingInspector(page, eventHandler);
    await page.goto(testUrl, { waitUntil: "networkidle2" });
    await page.waitForTimeout(1000);
    await fillForms(page);
    await page.waitForTimeout(100);
    await page.close();
    expect(rows.filter(r => r.type === "KeyLogging").sort()).toEqual(
      DATA_EXFILTRATION_MIXED.sort()
    );
  });
});
