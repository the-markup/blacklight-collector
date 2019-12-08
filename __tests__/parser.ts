import { join } from "path";
import { generateReport } from "../src/parser";
import { loadEventData } from "../src/utils";
it("can parse AddEventlistener events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "collector");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("behaviour_event_listeners", rawEvents);
  expect(report["KEYBOARD"]).toEqual([
    "http://localhost:8125/shared/event-listener.js",
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
  ]);
  expect(report["MOUSE"]).toEqual([
    "http://localhost:8125/shared/event-listener.js",
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
  ]);
  expect(report["SENSOR"]).toEqual([
    "http://localhost:8125/shared/event-listener.js"
  ]);
  expect(report["TOUCH"]).toEqual([
    "http://localhost:8125/shared/event-listener.js",
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
  ]);
  ["KEYBOARD", "MOUSE", "SENSOR", "TOUCH"];
});

it("can parse DataExfiltration events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("data_exfiltration", rawEvents);
  expect(Object.keys(report)).toEqual(["leadid.com", "fullstory.com"]);
});
