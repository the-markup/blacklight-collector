import { Page } from "puppeteer";
import { readFileSync } from "fs";
import { injectPlugins } from "./pptr-utils/eval-scripts";
import { jsInstruments } from "./plugins/js-instrument";
import { instrumentAddEventListener } from "./plugins/add-event-listener";
import { instrumentFingerprintingApis } from "./plugins/fingerprinting-apis";
import { BlacklightEvent, JsInstrumentData } from "./types";

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
  plugins = [instrumentAddEventListener, instrumentFingerprintingApis]
) {
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
            url: parsed.url,
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
        type: `Error.BlacklightInspector`,
        url: "",
        stack: [],
        data: {
          message: JSON.stringify(eventData)
        }
      });
    }
  });
};
