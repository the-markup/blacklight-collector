import url, { UrlWithStringQuery } from "url";
import fs from "fs";
import psl from "psl";
import { join } from "path";

export const getFirstPartyPs = firstPartyUri => {
  const topLevel = url.parse(firstPartyUri);
  return psl.get(topLevel.hostname);
};

export const isFirstParty = (firstPartyPs, testUri: UrlWithStringQuery) => {
  const testPs = psl.get(testUri.hostname) || "";
  return firstPartyPs === testPs;
};

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

export const clearDir = outDir => {
  if (fs.existsSync(outDir)) {
    deleteFolderRecursive(outDir);
  }
  fs.mkdirSync(outDir);
};

export const loadJSONSafely = str => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.log("couldnt load json", str);
    return {};
  }
};
export const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export function serializeCanvasCallMap(inputMap) {
  let obj = {};

  inputMap.forEach(function(value, key) {
    obj[key] = Array.from(value);
  });

  return obj;
}
export function mapToObj(inputMap) {
  let obj = {};

  inputMap.forEach(function(value, key) {
    obj[key] = value;
  });

  return obj;
}
export const getScriptUrl = item => {
  const { stack } = item;

  if (stack.length < 1) {
    return "";
  }
  if (typeof stack[0].fileName === "undefined") {
    if (typeof stack[0].fileName === "undefined") {
      return "";
    } else {
      return stack[0].source;
    }
  } else {
    return stack[0].fileName;
  }
};

export const loadEventData = (dir, filename = "inspection-log.ndjson") => {
  return fs
    .readFileSync(join(dir, filename), "utf-8")
    .split("\n")
    .filter(m => m)
    .map(m => loadJSONSafely(m));
};
