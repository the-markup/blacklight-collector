import { isBase64 } from "./utils";
import { Page, Request } from "puppeteer";
import { DEFAULT_INPUT_VALUES } from "./pptr-utils/interaction-utils";
import { BlacklightEvent } from "./types";
const ts = Object.values(DEFAULT_INPUT_VALUES);

export const setupDataExfiltrationInspector = async (
  page: Page,
  eventDataHandler: (event: BlacklightEvent) => void
) => {
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
            message: JSON.stringify(error)
          }
        });
      }
    }
  });
};
