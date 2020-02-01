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
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":4,"data":{"href":"http://localhost:8125/session_recorder.html","width":800,"height":600}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjo0LCJkYXRhIjp7ImhyZWYiOiJodHRwOi8vbG9jYWxob3N0OjgxMjUvc2Vzc2lvbl9yZWNvcmRlci5odG1sIiwid2lkdGgiOjgwMCwiaGVpZ2h0Ijo2MDB9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":2,"data":{"node":{"type":0,"childNodes":[{"type":2,"tagName":"html","attributes":{},"childNodes":[{"type":2,"tagName":"head","attributes":{},"childNodes":[{"type":3,"textContent":"\\n    ","id":4},{"type":2,"tagName":"script","attributes":{"src":"https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"},"childNodes":[],"id":5},{"type":3,"textContent":"\\n    ","id":6},{"type":2,"tagName":"script","attributes":{"src":"http://localhost:8125/shared/event-listener.js"},"childNodes":[],"id":7},{"type":3,"textContent":"\\n    ","id":8},{"type":2,"tagName":"script","attributes":{"src":"http://localhost:8125/shared/session-recorder-utils.js"},"childNodes":[],"id":9},{"type":3,"textContent":"\\n  ","id":10}],"id":3},{"type":3,"textContent":"\\n  ","id":11},{"type":2,"tagName":"body","attributes":{"onload":"start_test()"},"childNodes":[{"type":3,"textContent":"\\n    ","id":13},{"type":2,"tagName":"p","attributes":{},"childNodes":[{"type":3,"textContent":"Submit a form with the given encoding type in the URL params.","id":15}],"id":14},{"type":3,"textContent":"\\n    ","id":16},{"type":5,"textContent":" start_test will the \\"enc_type\\" attribute to the form ","id":17},{"type":3,"textContent":"\\n    ","id":18},{"type":2,"tagName":"form","attributes":{"id":"email_form","action":"","method":"post"},"childNodes":[{"type":3,"textContent":"\\n      ","id":20},{"type":2,"tagName":"input","attributes":{"type":"email","id":"email","name":"email","value":"test@example.com"},"childNodes":[],"id":21},{"type":2,"tagName":"br","attributes":{},"childNodes":[],"id":22},{"type":3,"textContent":"\\n      ","id":23},{"type":2,"tagName":"input","attributes":{"type":"text","id":"username","name":"username","value":"name surname"},"childNodes":[],"id":24},{"type":2,"tagName":"br","attributes":{},"childNodes":[],"id":25},{"type":3,"textContent":"\\n      ","id":26},{"type":2,"tagName":"input","attributes":{"type":"text","id":"test","name":"test","value":"ПриватБанк – банк для тих, хто йде вперед"},"childNodes":[],"id":27},{"type":2,"tagName":"br","attributes":{},"childNodes":[],"id":28},{"type":3,"textContent":"\\n      ","id":29},{"type":2,"tagName":"textarea","attributes":{"id":"multiline_text","name":"multiline_text"},"childNodes":[],"id":30},{"type":3,"textContent":"\\n      ","id":31},{"type":2,"tagName":"br","attributes":{},"childNodes":[],"id":32},{"type":3,"textContent":"\\n      ","id":33},{"type":2,"tagName":"input","attributes":{"type":"submit","value":"Submit"},"childNodes":[],"id":34},{"type":3,"textContent":"\\n    ","id":35}],"id":19},{"type":3,"textContent":"\\n    ","id":36},{"type":5,"textContent":" <p>Automated tests uses the following URLs to submit data in different encodings</p>\\n        <ul>\\n            <li><a\\n                    href=\\"/post_request.html?encoding_type=application/x-www-form-urlencoded\\">application/x-www-form-urlencoded</a>\\n            </li>\\n            <li><a href=\\"/post_request.html?encoding_type=text/plain\\">text/plain</a></li>\\n            <li><a href=\\"/post_request.html?encoding_type=multipart/form-data\\">multipart/form-data</a></li>\\n        </ul> ","id":37},{"type":3,"textContent":"\\n  \\n\\n","id":38}],"id":12}],"id":2}],"id":1},"initialOffset":{"left":0,"top":0}}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data: '{"events":{"type":3,"data":{"source":2,"type":5,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6MiwidHlwZSI6NSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data: '{"events":{"type":3,"data":{"source":2,"type":6,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6MiwidHlwZSI6NiwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data: '{"events":{"type":3,"data":{"source":2,"type":5,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6MiwidHlwZSI6NSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"btest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJ0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"bltest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsdGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blatest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYXRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blactest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWN0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacktest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrdGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blackltest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbHRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklitest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGl0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blackligtest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlndGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklightest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklighttest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHR0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-test@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtdGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-htest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaHRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-hetest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGV0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-heatest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhdGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headtest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZHRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headltest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGx0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headletest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxldGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headlestest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3Rlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headlesstest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3N0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@test@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@ttest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdHRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@thtest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGh0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@thetest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhldGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themtest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbXRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@thematest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWF0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themartest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFydGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarktest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3Rlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkutest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3V0ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkuptest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwdGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkup.test@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwLnRlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkup.otest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwLm90ZXN0QGV4YW1wbGUuY29tIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"blacklight-headless@themarkup.ortest@example.com","isChecked":false,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwLm9ydGVzdEBleGFtcGxlLmNvbSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyMX19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: [
        "blacklight-headless@themarkup.org",
        "1",
        "blacklight-headless@themarkup.org"
      ],
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
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: [
        "blacklight-headless@themarkup.org",
        "1",
        "blacklight-headless@themarkup.org"
      ],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6ImJsYWNrbGlnaHQtaGVhZGxlc3NAdGhlbWFya3VwLm9yZ3Rlc3RAZXhhbXBsZS5jb20iLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjF9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["1"],
      post_data: '{"events":{"type":3,"data":{"source":2,"type":6,"id":21}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["1"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6MiwidHlwZSI6NiwiaWQiOjIxfX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"Ida","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyNH19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaT","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVQiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTa","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI0fX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTar","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhciIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyNH19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarb","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmIiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbe","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI0fX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbel","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbCIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyNH19",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Tarbell", "Ida", "IdaTarbell", "IdaTarbell"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbell","isChecked":false,"id":24}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Tarbell", "Ida", "IdaTarbell", "IdaTarbell"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbGwiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6MjR9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"Ida","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYSIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyN319",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaT","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVQiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTa","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI3fX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTar","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhciIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyN319",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarb","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmIiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbe","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlIiwiaXNDaGVja2VkIjpmYWxzZSwiaWQiOjI3fX0=",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Ida"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbel","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Ida"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbCIsImlzQ2hlY2tlZCI6ZmFsc2UsImlkIjoyN319",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: false,
      filter: ["Tarbell", "Ida", "IdaTarbell", "IdaTarbell"],
      post_data:
        '{"events":{"type":3,"data":{"source":5,"text":"IdaTarbell","isChecked":false,"id":27}}}',
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
  },
  {
    data: {
      base_64: true,
      filter: ["Tarbell", "Ida", "IdaTarbell", "IdaTarbell"],
      post_data:
        "eyJ0eXBlIjozLCJkYXRhIjp7InNvdXJjZSI6NSwidGV4dCI6IklkYVRhcmJlbGwiLCJpc0NoZWNrZWQiOmZhbHNlLCJpZCI6Mjd9fQ==",
      post_request_url: "http://localhost:8125/bogus_submit.html"
    },
    stack: [
      {
        fileName: "http://localhost:8125/session_recorder.html",
        source: "RequestHandler"
      }
    ],
    type: "DataExfiltration",
    url: "http://localhost:8125/session_recorder.html"
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
