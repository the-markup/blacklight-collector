import { Page, Request } from "puppeteer";
import { readFileSync } from "fs";
import { DEFAULT_INPUT_VALUES } from "./pptr-utils/interaction-utils";
import { injectPlugins } from "./pptr-utils/eval-scripts";
import { jsInstruments } from "./plugins/js-instrument";
import { instrumentAddEventListener } from "./plugins/add-event-listener";
import { instrumentFingerprintingApis } from "./plugins/fingerprinting-apis";
import { BlacklightEvent, JsInstrumentData } from "./types";

function isBase64(str) {
  if (str === "" || str.trim() === "") {
    return false;
  }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}
function getPageScriptAsString(observers, testing = false) {
  let observersString = "";
  let observersNameString = "";
  observers.forEach(o => {
    observersString += `${o}\n`;
    observersNameString += `${o.name},`;
  });
  return `${jsInstruments}\n${observersString}(${injectPlugins}(jsInstruments,[${observersNameString}],StackTrace,${
    testing ? "true" : "false"
  }))`;
}
const BEHAVIOUR_TRACKING_EVENTS = {
  MOUSE: ["click", "mousedown", "mouseup", "mousemove", "select", "dblclick"],
  KEYBOARD: ["keydown", "keypress", "keyup", "input"],
  TOUCH: ["touchmove", "touchstart", "touchend", "touchcancel"],
  SENSOR: ["devicemotion", "deviceorientation", "orientationchange"]
};
const MONITORED_EVENTS = [].concat(...Object.values(BEHAVIOUR_TRACKING_EVENTS));
export const setupBlacklightInspector = async function(
  page: Page,
  eventDataHandler: (event: BlacklightEvent) => void,
  testing = false,
  plugins = [instrumentAddEventListener, instrumentFingerprintingApis],
  inputValues = DEFAULT_INPUT_VALUES
) {
  const ts = Object.values(inputValues);

  const stackTraceHelper = readFileSync(
    require.resolve("stacktrace-js/dist/stacktrace.js"),
    "utf8"
  );
  await page.evaluateOnNewDocument(stackTraceHelper);
  await page.evaluateOnNewDocument(getPageScriptAsString(plugins, testing));

  await page.exposeFunction("reportEvent", eventData => {
    try {
      const parsed: BlacklightEvent = JSON.parse(eventData);
      const data = <JsInstrumentData>parsed.data;
      if (data.symbol.indexOf("addEventListener") > -1) {
        const values = JSON.parse(data.value);
        if (MONITORED_EVENTS.includes(values[0])) {
          const eventGroup = Object.keys(
            BEHAVIOUR_TRACKING_EVENTS
          ).filter(key => BEHAVIOUR_TRACKING_EVENTS[key].includes(values[0]));

          eventDataHandler({
            type: "AddEventListener",
            url: window.location.href,
            stack: parsed.stack,
            data: {
              name: values[0],
              event_group: eventGroup.length ? eventGroup[0] : ""
            }
          });
        }
      }
      eventDataHandler(parsed);
    } catch (error) {
      eventDataHandler({
        type: `Error.AddEventListener`,
        url: window.location.href,
        stack: [],
        data: {
          message: error
        }
      });
    }
  });

  await page.on("request", (request: Request) => {
    let stack = [
      {
        fileName: request.frame().url(),
        source: `RequestHandler`
      }
    ];
    if (request.method() === "POST") {
      try {
        let filter = [];
        if (isBase64(request.postData())) {
          filter = ts.filter(t => atob(request.postData()).indexOf(t) > -1);
        } else {
          filter = ts.filter(t => request.postData().indexOf(t) > -1);
        }
        if (filter.length > 0) {
          eventDataHandler({
            type: `DataExfiltration`,
            url: request.frame().url(),
            stack,
            data: {
              post_request_url: request.url(),
              post_data: request.postData(),
              base_64: isBase64(request.postData()),
              filter
            }
          });
        }
      } catch (error) {
        eventDataHandler({
          type: `Error.DataExfiltration`,
          url: request.frame().url(),
          stack,
          data: {
            message: error
          }
        });
      }
    }
  });
};
