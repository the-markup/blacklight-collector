import { join } from "path";
import { loadEventData, generateReport } from "../src/parser";

it("can parse AddEventlistener events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "collector");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("EventListeners", rawEvents);
  console.log(report.entries());
  expect(report.get("KEYBOARD")).toEqual(
    new Set([
      "http://localhost:8125/shared/event-listener.js",
      "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    ])
  );
  expect(report.get("MOUSE")).toEqual(
    new Set([
      "http://localhost:8125/shared/event-listener.js",
      "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    ])
  );
  expect(report.get("SENSOR")).toEqual(
    new Set(["http://localhost:8125/shared/event-listener.js"])
  );
  expect(report.get("TOUCH")).toEqual(
    new Set([
      "http://localhost:8125/shared/event-listener.js",
      "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js"
    ])
  );
  [, "MOUSE", "SENSOR", "TOUCH"];
});

it("can parse DataExfiltration events", async () => {
  const TEST_DIR = join(__dirname, "test-data", "veteransunited");
  const rawEvents = loadEventData(TEST_DIR);
  const report = generateReport("DataExfiltration", rawEvents);
  expect(Object.keys(report)).toEqual(["leadid.com", "fullstory.com"]);
});
