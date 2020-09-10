import { BlacklightEvent, JsInstrumentEvent } from "./types";

/**
 *  @fileOverview Utility functions for canvas finerprinting analysis.
 *  Implemented following the Princeton study's methodology.
 */

import { parse } from "url";
import { getScriptUrl, serializeCanvasCallMap } from "./utils";

const MIN_CANVAS_IMAGE_WIDTH = 16;
const MIN_CANVAS_IMAGE_HEIGHT = 16;
const MIN_FONT_LIST_SIZE = 50;
const MIN_TEXT_MEASURE_COUNT = 50;
const MIN_TEXT_LENGTH = 10;
/**
 * Return the string that is written onto canvas from function arguments
 * @param arguments
 */
const getCanvasText = (args: string[]) => {
  if (!args || !args[0]) {
    return "";
  }
  return args[0].toString();
};

const getTextLength = (text: string) => {
  // stackoverflow.com/questions/54369513/how-to-count-the-correct-length-of-a-string-with-emojis-in-javascript
  return [...text].length;
};

/**
 * Check if the retrieved pixel data is larger than min. dimensions.
 * {@link https://developer.mozilla.org/en-US/docsz1/Web/API/CanvasRenderingContext2D/getImageData#Parameters | Web API Image Data Parameters}
 * @param arguments
 */
const isGetImageDataDimsTooSmall = (args: string[]) => {
  const sw = parseInt(args[2], 10);
  const sh = parseInt(args[3], 10);
  return sw < MIN_CANVAS_IMAGE_WIDTH || sh < MIN_CANVAS_IMAGE_HEIGHT;
};
type ScriptUrl = string;
type CanvasCallValue = string;
type CanvasCallMap = Map<ScriptUrl, Set<CanvasCallValue>>;
/**
 * This function takes a list of Javascript calls to HTML Canvas properties from a browsers window object.
 * It sorts the functions in order to evaluate which script are fingerprinting a browser using the criteria
 * described by Englehardt & Narayanan, 2016
 * We Filter for 4 Criteria
 * Criteria 1: The canvas element’s height and width properties must not be set below 16
 * Criteria 2: Text must be written to canvas with least two colors or at least 10 distinct charachters
 * Criteria 3: The script should not call the save, restore, or addEventListener  methods of the rendering context.
 * Criteria 4: The script extracts an image withtoDataURL or with a single call togetImageData that specifies an area with a minimum size of 16px×16px
 * @param canvasCalls
 * @see {@link http://randomwalker.info/publications/OpenWPM_1_million_site_tracking_measurement.pdf#page=12}
 */
export const sortCanvasCalls = (canvasCalls: BlacklightEvent[]) => {
  const CANVAS_READ_FUNCS = [
    "HTMLCanvasElement.toDataURL",
    "CanvasRenderingContext2D.getImageData",
  ];

  const CANVAS_WRITE_FUNCS = [
    "CanvasRenderingContext2D.fillText",
    "CanvasRenderingContext2D.strokeText",
  ];
  const CANVAS_FP_DO_NOT_CALL_LIST = [
    "CanvasRenderingContext2D.save",
    "CanvasRenderingContext2D.restore",
    "HTMLCanvasElement.addEventListener",
  ];

  const cReads = new Map() as CanvasCallMap;
  const cDataUrls = new Map() as CanvasCallMap;
  const cWrites = new Map() as CanvasCallMap;
  const cTexts = new Map() as CanvasCallMap;
  const cBanned = new Map() as CanvasCallMap;
  const cStyles = new Map() as CanvasCallMap;
  for (const item of canvasCalls) {
    const { url, data } = item as JsInstrumentEvent;
    const url_host = parse(url).hostname;
    const script_url = getScriptUrl(item);
    const { symbol, operation, value } = data;
    if (
      typeof script_url === "undefined" ||
      script_url.indexOf("http:") < -1 ||
      script_url.indexOf("https:") < -1
    ) {
      continue;
    }

    if (CANVAS_READ_FUNCS.includes(symbol) && operation === "call") {
      if (
        symbol === "CanvasRenderingContext2D.getImageData" &&
        isGetImageDataDimsTooSmall(data.arguments)
      ) {
        continue;
      }
      if (symbol === "HTMLCanvasElement.toDataURL") {
        cDataUrls.has(script_url)
          ? cDataUrls.get(script_url).add(value)
          : cDataUrls.set(script_url, new Set([value]));
      }
      cReads.has(script_url)
        ? cReads.get(script_url).add(url_host)
        : cReads.set(script_url, new Set([url_host]));
    } else if (CANVAS_WRITE_FUNCS.includes(symbol)) {
      const text = getCanvasText(data.arguments);

      if (getTextLength(text) < MIN_TEXT_LENGTH || text.includes("🏴​")) {
        continue;
      }
      cWrites.has(script_url)
        ? cWrites.get(script_url).add(url_host)
        : cWrites.set(script_url, new Set([url_host]));
      cTexts.has(script_url)
        ? cTexts.get(script_url).add(text)
        : cTexts.set(script_url, new Set([text]));
    } else if (
      symbol === "CanvasRenderingContext2D.fillStyle" &&
      operation === "set"
    ) {
      cStyles.has(script_url)
        ? cStyles.get(script_url).add(value)
        : cStyles.set(script_url, new Set([value]));
    } else if (
      CANVAS_FP_DO_NOT_CALL_LIST.includes(symbol) &&
      operation === "call"
    ) {
      cBanned.has(script_url)
        ? cBanned.get(script_url).add(url_host)
        : cBanned.set(script_url, new Set([url_host]));
    }
  }
  return {
    cBanned,
    cDataUrls,
    cReads,
    cStyles,
    cTexts,
    cWrites,
  };
};

/**
 * This function takes a list of canvas calls and determines which scripts are fingerprinting
 * @see {@link sortCanvasCalls}
 * @param canvasCalls
 */
export const getCanvasFp = (
  canvasCalls,
): {
  fingerprinters: string[];
  texts: any;
  styles: any;
  data_url: any;
} => {
  const {
    cDataUrls,
    cReads,
    cWrites,
    cBanned,
    cTexts,
    cStyles,
  } = sortCanvasCalls(canvasCalls);

  const fingerprinters: Set<string> = new Set();
  for (const [script_url, url_hosts] of cReads.entries()) {
    if (fingerprinters.has(script_url)) {
      continue;
    }

    const rwIntersection = new Set(
      [...url_hosts].filter(
        x => cWrites.has(script_url) && cWrites.get(script_url).has(x),
      ),
    );

    if (rwIntersection.size < 1) {
      continue;
    }
    for (const canvasRwVisit of rwIntersection.values()) {
      if (
        cBanned.has(script_url) &&
        cBanned.get(script_url).has(canvasRwVisit)
      ) {
        // console.log(
        //   `Ignoring script ${script_url} from url_host ${canvasRwVisit}`
        // );
        continue;
      }
      fingerprinters.add(script_url);
    }
  }
  return {
    data_url: serializeCanvasCallMap(cDataUrls),
    fingerprinters: Array.from(fingerprinters),
    styles: serializeCanvasCallMap(cStyles),
    texts: serializeCanvasCallMap(cTexts),
  };
};

export const getCanvasFontFp = jsCalls => {
  const CANVAS_FONT = [
    "CanvasRenderingContext2D.measureText",
    "CanvasRenderingContext2D.font",
  ];
  const font_shorthand = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_\{\}\(\)\&!\',\*\.\"\sa-zA-Z0-9]+?)\s*$/g;
  const textMeasure = new Map() as Map<string, any>;
  const canvasFont = new Map() as CanvasCallMap;
  for (const item of jsCalls) {
    const script_url = getScriptUrl(item);
    const { symbol, value } = item.data;
    if (CANVAS_FONT.includes(symbol)) {
      if (symbol.indexOf("measureText") > -1) {
        const textToMeasure: string = item.data.arguments[0];
        if (textMeasure.has(script_url)) {
          textMeasure.get(script_url)[textToMeasure] += 1;
        } else {
          const val = { [textToMeasure]: 1 };
          textMeasure.set(script_url, val);
        }
      }

      if (symbol.indexOf("font") > -1) {
        if (font_shorthand.test(value)) {
          canvasFont.has(script_url)
            ? canvasFont.get(script_url).add(value)
            : canvasFont.set(script_url, new Set([value]));
        }
      }
    }
  }

  canvasFont.forEach((value, key, map) => {
    if (value.size < MIN_FONT_LIST_SIZE) {
      map.delete(key);
    }
  });
  textMeasure.forEach((value, key, map) => {
    if (value.size < MIN_TEXT_MEASURE_COUNT) {
      map.delete(key);
    }
  });
  return {
    canvas_font: serializeCanvasCallMap(canvasFont),
    text_measure: serializeCanvasCallMap(textMeasure),
  };
};
