import {
  fromPuppeteerDetails,
  PuppeteerBlocker,
} from "@cliqz/adblocker-puppeteer";
import fs from "fs";
import path from "path";
import url from "url";
import { BlacklightEvent } from "./types";

// TODO: New Test for Facebook Trackers

// This code is a slightly modified version of  https://github.com/EU-EDPS/website-evidence-collector/blob/master/lib/setup-beacon-recording.js
// The following options make sure that blocker will behave optimally for the
// use-case of identifying blocked network requests as well as the rule which
// triggered blocking in the first place.
const blockerOptions = {
  // This makes sure that the instance of `PuppeteerBlocker` keeps track of the
  // exact original rule form (from easylist or easyprivacy). Otherwise some
  // information might be lost and calling `toString(...)` will only give back
  // an approximate version.
  debug: true,

  // By default, instance of `PuppeteerBlocker` will perform some dynamic
  // optimizations on rules to increase speed. As a result, it might not always
  // be possible to get back the original rule which triggered a 'match' for
  // a specific request. Disabling these optimizations will always ensure we
  // can know which rule triggered blocking.
  enableOptimizations: false,

  // We are only interested in "network rules" to identify requests which would
  // be blocked. Disabling "cosmetic rules" allows to resources.
  loadCosmeticFilters: false,
};

// setup easyprivacy matching
// https://github.com/cliqz-oss/adblocker/issues/123
const blockers = {
  "easyprivacy.txt": PuppeteerBlocker.parse(
    fs.readFileSync(
      path.join(__dirname, "../data/blocklists/easyprivacy.txt"),
      "utf8"
    ),
    blockerOptions
  ),
};

const safelyDecodeUri = (uri) => {
  try {
    return decodeURIComponent(uri);
  } catch (e) {
    return "";
  }
};
// source: https://gist.github.com/pirate/9298155edda679510723#gistcomment-2734349
const decodeURLParams = (search) => {
  const hashes = search.slice(search.indexOf("?") + 1).split("&");
  return hashes.reduce((params, hash) => {
    const split = hash.indexOf("=");

    if (split < 0) {
      return { ...params, [hash]: null };
    }

    const key = hash.slice(0, split);
    const val = hash.slice(split + 1);
    return {
      ...params,
      [key]: safelyDecodeUri(val),
    };
  }, {});
};
const parseJSONSafely = (str) => {
  try {
    const data = JSON.parse(str);
    return data;
  } catch (error) {
    return str;
  }
};
export const setupThirdpartyTrackersInspector = async (
  page,
  eventDataHandler: (event: BlacklightEvent) => void,
  blockRequests = false
) => {
  if (blockRequests) {
    await page.setRequestInterception(true);
  }
  page.on("request", async (request) => {
    let blocked = false;
    Object.entries(blockers).forEach(([listName, blocker]) => {
      const {
        match, // `true` if there is a match
        filter, // instance of NetworkFilter which matched
      } = blocker.match(fromPuppeteerDetails(request));
      if (match) {
        const stack = [
          {
            fileName: request.frame().url(),
            source: `requested from ${request
              .frame()
              .url()} and matched with ${listName} filter ${filter}`,
          },
        ];
        const parsedUrl = url.parse(request.url());
        let query = null;
        if (parsedUrl.query) {
          query = decodeURLParams(parsedUrl.query);
          for (const param in query) {
            if (query.hasOwnProperty(param)) {
              query[param] = parseJSONSafely(query[param]);
            }
            // TODO: Add sha-256 check npm ->"js-sha256";
          }
        }
        eventDataHandler({
          data: {
            filter: filter.toString(),
            listName,
            query,
          },
          stack,
          type: "TrackingRequest",
          url: request.url(),
        });
        if (blockRequests) {
          request.abort();
          blocked = true;
        }
      }
    });
    if (blockRequests && !blocked) {
      request.continue();
    }
  });
};
