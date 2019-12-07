import url, { UrlWithStringQuery } from "url";
import fs from "fs";
import psl from "psl";

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
