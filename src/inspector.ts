import { Page } from "puppeteer";
import { readFileSync } from "fs";
import { injectPlugins } from "./pptr-utils/eval-scripts";
import { jsInstruments } from "./plugins/js-instrument";
import { instrumentAddEventListener } from "./plugins/add-event-listener";
import { instrumentFingerprintingApis } from "./plugins/fingerprinting-apis";
import { BlacklightEvent } from "./types";

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
//scroll

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
      const parsed = JSON.parse(eventData);
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
