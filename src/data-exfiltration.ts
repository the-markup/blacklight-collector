import { Page, Request } from "puppeteer";
import {
  DEFAULT_INPUT_VALUES,
  DEFAULT_AUTOCOMPLETE_VALUES
} from "./pptr-utils/interaction-utils";
import { BlacklightEvent } from "./types";
import { isBase64 } from "./utils";
const ts = [
  ...Object.values(DEFAULT_AUTOCOMPLETE_VALUES),
  ...Object.values(DEFAULT_INPUT_VALUES)
];

export const setupDataExfiltrationInspector = async (
  page: Page,
  eventDataHandler: (event: BlacklightEvent) => void
) => {
  await page.on("request", (request: Request) => {
    const stack = [
      {
        fileName: request.frame().url(),
        source: `RequestHandler`
      }
    ];
    if (request.method() === "POST") {
      try {
        let filter = [];
        filter = ts.filter(t =>
          isBase64(request.postData())
            ? atob(request.postData()).indexOf(t) > -1
            : request.postData().indexOf(t) > -1
        );
        if (filter.length > 0) {
          eventDataHandler({
            data: {
              base_64: isBase64(request.postData()),
              filter,
              post_data: request.postData(),
              post_request_url: request.url()
            },
            stack,
            type: `DataExfiltration`,
            url: request.frame().url()
          });
        }
      } catch (error) {
        eventDataHandler({
          data: {
            message: JSON.stringify(error)
          },
          stack,
          type: `Error.DataExfiltration`,
          url: request.frame().url()
        });
      }
    }
  });
};
