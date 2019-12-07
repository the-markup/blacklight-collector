import { join } from "path";
import fs from "fs";
import psl from "psl";
import url from "url";
import { groupBy, loadJSONSafely } from "./utils";
// import {  } from "lodash";

export const generateReport = function(reportType, messages) {
  switch (reportType) {
    case "Cookies":
      break;
    case "DataExfiltration":
      return reportDataExiltration(
        filterByEvent(messages, ["DataExfiltration"])
      );
      break;
    case "EventListeners":
      return reportEventListeners(
        filterByEvent(messages, ["AddEventListener"])
      );
    case "Fingerprinting":
      break;
    case "WebBeacons":
      break;
    default:
      break;
  }
};
export const loadEventData = (dir, filename = "inspection-log.ndjson") => {
  return fs
    .readFileSync(join(dir, filename), "utf-8")
    .split("\n")
    .filter(m => m)
    .map(m => loadJSONSafely(m));
};
const filterByEvent = (messages, eventTypes) => {
  const parsed = messages.map(m => m.message);
  return parsed.filter(p => eventTypes.includes(p.type));
};

const reportEventListeners = messages => {
  return messages.reduce((acc, cur) => {
    if (acc.has(cur.data.event_group)) {
      acc.get(cur.data.event_group).add(cur.stack[0].fileName);
    } else {
      acc.set(cur.data.event_group, new Set([cur.stack[0].fileName]));
    }

    return acc;
  }, new Map());
};

const reportDataExiltration = messages => {
  const groupByRequestPs = groupBy("post_request_ps");
  return groupByRequestPs(
    messages.map(m => ({
      ...m.data,
      post_request_ps: psl.get(url.parse(m.data.post_request_url).hostname)
    }))
  );
};
