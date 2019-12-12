import { getDomain } from "tldts";
import { groupBy, getScriptUrl } from "./utils";
import { getCanvasFp, getCanvasFontFp } from "./canvas-fingerprinting";
import {
  DataExfiltrationData,
  BlacklightEvent,
  AddEventListenerData,
  BlacklightEventType
} from "./types";

export const generateReport = function(reportType, messages) {
  const eventData = getEventData(reportType, messages);
  switch (reportType) {
    case "cookies":
      return {};
    case "data_exfiltration":
      return reportDataExiltration(eventData);
    case "behaviour_event_listeners":
      return reportEventListeners(eventData);
    case "canvas_fingerprinters":
      return reportCanvasFingerprinters(eventData);
    case "canvas_font_fingerprinters":
      return reportCanvasFontFingerprinters(eventData);
    case "web_beacons":
      return eventData;
    default:
      return {};
  }
};

const filterByEvent = (messages, typePattern: BlacklightEventType) => {
  return messages.filter(
    m =>
      m.message.type.includes(typePattern) && !m.message.type.includes("Error")
  );
};
const getEventData = function(reportType, messages): BlacklightEvent[] {
  let filtered = [];
  switch (reportType) {
    case "cookies":
      break;
    case "data_exfiltration":
      filtered = filterByEvent(messages, "DataExfiltration");
      break;
    case "behaviour_event_listeners":
      filtered = filterByEvent(messages, "AddEventListener");
      break;
    case "canvas_fingerprinters":
      filtered = filterByEvent(messages, "JsInstrument");
      break;
    case "canvas_font_fingerprinters":
      filtered = filterByEvent(messages, "JsInstrument");
      break;
    case "enumerate_devices":
      //TODO
      break;
    case "web_audio":
      //TODO
      break;
    case "web_beacons":
      filtered = filterByEvent(messages, "TrackingRequest");

      break;
    default:
      return [];
  }
  return filtered.map(m => m.message);
};

const reportEventListeners = (eventData: BlacklightEvent[]) => {
  return eventData.reduce((acc, cur) => {
    const script = getScriptUrl(cur);
    const data = <AddEventListenerData>cur.data;
    if (!script) {
      return acc;
    }
    if (Object.keys(acc).includes(data.event_group)) {
      acc[data.event_group].includes(script)
        ? ""
        : acc[data.event_group].push(script);
    } else {
      acc[data.event_group] = [script];
    }
    return acc;
  }, {});
};

export const reportCanvasFingerprinters = (eventData: BlacklightEvent[]) => {
  return getCanvasFp(eventData);
};

export const reportCanvasFontFingerprinters = (
  eventData: BlacklightEvent[]
) => {
  return getCanvasFontFp(eventData);
};

const reportDataExiltration = (eventData: BlacklightEvent[]) => {
  const groupByRequestPs = groupBy("post_request_ps");
  return groupByRequestPs(
    eventData.map(m => ({
      ...m.data,
      post_request_ps: getDomainSafely(<DataExfiltrationData>m.data)
    }))
  );
};

// const reportWebBeacons = (eventData: BlacklightEvent[]) => {
//   filtered = filterByEvent(messages, "DataExfiltration");
// };

const getDomainSafely = (message: DataExfiltrationData) => {
  try {
    if (message.post_request_url) {
      return getDomain(message.post_request_url);
    } else {
      console.error(
        "message.data missing post_request_url",
        JSON.stringify(message)
      );
      return "";
    }
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(message));
    return "";
  }
};
