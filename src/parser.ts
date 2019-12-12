import { getDomain } from "tldts";
import { groupBy, getScriptUrl } from "./utils";
import { getCanvasFp, getCanvasFontFp } from "./canvas-fingerprinting";
import {
  DataExfiltrationData,
  BlacklightEvent,
  BlacklightEventType,
  FINGERPRINTABLE_WINDOW_APIS,
  JsInstrumentData,
  BEHAVIOUR_TRACKING_EVENTS
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
    case "fingerprintable_api_calls":
      return reportFingerprintableAPIs(eventData);
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
      filtered = filterByEvent(messages, "JsInstrument");
      break;
    case "canvas_fingerprinters":
      filtered = filterByEvent(messages, "JsInstrument");
      break;
    case "canvas_font_fingerprinters":
      filtered = filterByEvent(messages, "JsInstrument");
      break;
    case "fingerprintable_api_calls":
      filtered = filterByEvent(messages, "JsInstrument");
      break;
    case "web_beacons":
      filtered = filterByEvent(messages, "TrackingRequest");

      break;
    default:
      return [];
  }
  return filtered.map(m => m.message);
};

const MONITORED_EVENTS = [].concat(...Object.values(BEHAVIOUR_TRACKING_EVENTS));
const reportEventListeners = (eventData: BlacklightEvent[]) => {
  const parsedEvents = [];
  eventData.forEach((event: BlacklightEvent) => {
    const data = <JsInstrumentData>event.data;
    if (data.symbol.indexOf("addEventListener") > -1) {
      const values = JSON.parse(data.value);
      if (MONITORED_EVENTS.includes(values[0])) {
        const eventGroup = Object.keys(BEHAVIOUR_TRACKING_EVENTS).filter(key =>
          BEHAVIOUR_TRACKING_EVENTS[key].includes(values[0])
        );
        parsedEvents.push({
          url: event.url,
          stack: event.stack,
          data: {
            name: values[0],
            event_group: eventGroup.length ? eventGroup[0] : ""
          }
        });
      }
    }
  });
  return parsedEvents.reduce((acc, cur) => {
    const script = getScriptUrl(<BlacklightEvent>cur);
    const data = cur.data;
    if (!script) {
      return acc;
    }
    if (Object.keys(acc).includes(data.event_group)) {
      acc[data.event_group].push({ name: data.name, script });
    } else {
      acc[data.event_group] = [{ name: data.name, script }];
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

const WINDOW_FP_LIST = [].concat(...Object.values(FINGERPRINTABLE_WINDOW_APIS));
const reportFingerprintableAPIs = (eventData: BlacklightEvent[]) => {
  const parsedEvents = [];
  eventData.forEach(event => {
    const data = <JsInstrumentData>event.data;
    if (WINDOW_FP_LIST.includes(data.symbol)) {
      const windowApiGroup = Object.keys(
        FINGERPRINTABLE_WINDOW_APIS
      ).filter(key => FINGERPRINTABLE_WINDOW_APIS[key].includes(data.symbol));
      parsedEvents.push({
        api_group: windowApiGroup[0],
        symbol: data.symbol,
        stack: event.stack
      });
    }
  });

  return parsedEvents.reduce((acc, cur) => {
    const script = getScriptUrl(<BlacklightEvent>cur);
    if (!script) {
      return acc;
    }
    if (Object.keys(acc).includes(cur.api_group)) {
      acc[cur.api_group].push({ symbol: cur.symbol, script });
    } else {
      acc[cur.api_group] = [{ symbol: cur.symbol, script }];
    }
    return acc;
  }, {});
};

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
