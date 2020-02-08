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
  { type: "tel", value: "+1971112233", name: "phone" },
  { type: "text", value: "1337 Broadway", name: "ship-address" },
  { type: "text", value: "IdaTarbell", name: "ship-city" },
  { type: "text", value: "IdaTarbell", name: "ship-state" },
  { type: "text", value: "10011", name: "ship-zip" },
  { type: "text", value: "IdaTarbell", name: "ship-country" },
  { type: "checkbox", value: "on", name: "billAndShip" },
  { type: "text", value: "IdaTarbell", name: "maiden-name" },
  { type: "text", value: "IdaTarbell", name: "ssn" },
  { type: "date", value: "", name: "birthday" },
  { type: "text", value: "IdaTarbell", name: "username" },
  { type: "password", value: "SUPERSECRETP@SSW0RD", name: "password" },
  { type: "text", value: "IdaTarbell", name: "website" },
  { type: "text", value: "IDATARBELL", name: "ccname" },
  { type: "text", value: "4242424242424242", name: "cardnumber" },
  { type: "text", value: "IdaTarbell", name: "cvc" },
  { type: "text", value: "01/2022", name: "cc-exp" }
];
jest.setTimeout(10000);
const DATA_EXFILTRATION =     [{"data":{"base_64":false,"filter":["blacklight-headless@themarkup.org","blacklight-headless@themarkup.org"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"blacklight-headless@themarkup.orgtest@example.com\",\"isChecked\":false,\"id\":21}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["blacklight-headless@themarkup.org","blacklight-headless@themarkup.org"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwLm9yZ3Rlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"Ida\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyNH19","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaT\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVQiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTa\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI0fX0=","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTar\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhciIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyNH19","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarb\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmIiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarbe\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI0fX0=","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarbel\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbCIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyNH19","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Tarbell","Ida","IdaTarbell","IdaTarbell"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarbell\",\"isChecked\":false,\"id\":24}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Tarbell","Ida","IdaTarbell","IdaTarbell"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbGwiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"Ida\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyN319","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaT\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVQiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTa\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI3fX0=","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTar\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhciIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyN319","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarb\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmIiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarbe\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI3fX0=","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Ida"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarbel\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Ida"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbCIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyN319","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":false,"filter":["Tarbell","Ida","IdaTarbell","IdaTarbell"],"post_data":"{\"events\":{\"type\":3,\"data\":{\"source\":5,\"text\":\"IdaTarbell\",\"isChecked\":false,\"id\":27}}}","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"},{"data":{"base_64":true,"filter":["Tarbell","Ida","IdaTarbell","IdaTarbell"],"post_data":"eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbGwiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==","post_request_url":"http://localhost:8125/bogus_submit.html"},"stack":[{"fileName":"http://localhost:8125/session_recorder.html","source":"RequestHandler"}],"type":"DataExfiltration","url":"http://localhost:8125/session_recorder.html"}]
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
