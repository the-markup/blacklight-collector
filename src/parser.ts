import { getDomain } from "tldts";
import { groupBy, getScriptUrl } from "./utils";
import { getCanvasFp, getCanvasFontFp } from "./canvas-fingerprinting";
import {
  BlacklightEvent,
  FINGERPRINTABLE_WINDOW_APIS,
  BEHAVIOUR_TRACKING_EVENTS,
  JsInstrumentEvent,
  DataExfiltrationEvent
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

const filterByEvent = (messages, typePattern) => {
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
  eventData.forEach((event: JsInstrumentEvent) => {
    const data = event.data;
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
  const output = parsedEvents.reduce((acc, cur) => {
    const script = getScriptUrl(<BlacklightEvent>cur);
    const data = cur.data;
    if (!script) {
      return acc;
    }

    if (acc.hasOwnProperty(data.event_group)) {
      // console.log(data.event_group, script, cur.symbol);
      if (acc[data.event_group].hasOwnProperty(script)) {
        acc[data.event_group][script].add(data.name);
      } else {
        acc[data.event_group][script] = new Set([data.name]);
      }
    } else {
      acc[data.event_group] = { [script]: new Set([data.name]) };
    }
    return acc;
  }, {});

  const serializable = {};
  for (let [event_group, script_obj] of Object.entries(output)) {
    serializable[event_group] = {};
    for (let [script, events] of Object.entries(script_obj)) {
      serializable[event_group][script] = Array.from(<any>events);
    }
  }
  return serializable;
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
    eventData.map((m: DataExfiltrationEvent) => ({
      ...m.data,
      post_request_ps: getDomainSafely(m)
    }))
  );
};

const WINDOW_FP_LIST = [].concat(...Object.values(FINGERPRINTABLE_WINDOW_APIS));
const reportFingerprintableAPIs = (eventData: BlacklightEvent[]) => {
  const parsedEvents = [];
  eventData.forEach((event: JsInstrumentEvent) => {
    const data = event.data;
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
  const output = parsedEvents.reduce((acc, cur) => {
    const script = getScriptUrl(<BlacklightEvent>cur);
    if (!script) {
      return acc;
    }

    if (acc.hasOwnProperty(cur.api_group)) {
      // console.log(cur.api_group, script, cur.symbol);
      if (acc[cur.api_group].hasOwnProperty(script)) {
        acc[cur.api_group][script].add(cur.symbol);
      } else {
        acc[cur.api_group][script] = new Set([cur.symbol]);
      }
    } else {
      acc[cur.api_group] = { [script]: new Set([cur.symbol]) };
    }
    return acc;
  }, {});

  const serializable = {};
  for (let [api_group, script_obj] of Object.entries(output)) {
    serializable[api_group] = {};
    for (let [script, events] of Object.entries(script_obj)) {
      serializable[api_group][script] = Array.from(<any>events);
    }
  }
  return serializable;
};

const getDomainSafely = (message: DataExfiltrationEvent) => {
  try {
    if (message.data.post_request_url) {
      return getDomain(message.data.post_request_url);
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
