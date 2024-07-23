import crypto from 'crypto';
import fs from 'fs';
import { join } from 'path';
import { getDomain, getPublicSuffix } from 'tldts';
import { BlacklightEvent } from './types';
export const getFirstPartyPs = firstPartyUri => {
    return getPublicSuffix(firstPartyUri);
};

export const isFirstParty = (firstPartyPs, testUri) => {
    return firstPartyPs === testUri;
};

const deleteFolderRecursive = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = path + '/' + file;
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

export const closeBrowser = async (browser) => {
    console.log("closing browser");
    const pages = await browser.pages();
    console.log(`closing ${pages.length} pages`);
    for (let i = 0; i < pages.length; i++) {
      await pages[i].close();
      console.log('closed page');
    }

    console.log("before closing browser");
    await browser.close();
    console.log("after closing browser");
};

export const clearDir = (outDir, mkNewDir = true) => {
    if (fs.existsSync(outDir)) {
        deleteFolderRecursive(outDir);
    }
    if (mkNewDir) {
        fs.mkdirSync(outDir);
    }
};

export const loadJSONSafely = str => {
    try {
        return JSON.parse(str);
    } catch (error) {
        console.log('couldnt load json safely', str);
        return { level: 'error' };
    }
};
export const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

export const serializeCanvasCallMap = inputMap => {
    const obj = {};

    inputMap.forEach((value, key) => {
        obj[key] = value instanceof Set ? Array.from(value) : value;
    });

    return obj;
};
export const mapToObj = inputMap => {
    const obj = {};

    inputMap.forEach((value, key) => {
        obj[key] = value;
    });

    return obj;
};
// Go through the stack trace and get the first filename.
// If no fileName is found return the source of the last function in
// the trace
export const getScriptUrl = (item: BlacklightEvent) => {
    const { stack } = item;

    for (let i = 0; i < stack.length; i++) {
        if (stack[i].hasOwnProperty('fileName')) {
            return stack[i].fileName;
        } else {
            if (i === stack.length - 1) {
                return !!stack[i].source ? stack[i].source : '';
            }
        }
    }
};

export const loadEventData = (dir, filename = 'inspection-log.ndjson') => {
    return fs
        .readFileSync(join(dir, filename), 'utf-8')
        .split('\n')
        .filter(m => m)
        .map(m => loadJSONSafely(m))
        .filter(m => m.level === 'warn');
};
// Not using this atm but leaving it in because it might be useful in the future
export const getStackType = (stack, firstPartyDomain) => {
    let hasFirstParty = false;
    let hasThirdParty = false;
    stack.forEach(s => {
        if (s.hasOwnProperty('fileName')) {
            const scriptDomain = getDomain(s.fileName);
            if (scriptDomain === firstPartyDomain) {
                hasFirstParty = true;
            } else {
                hasThirdParty = true;
            }
        }
    });
    if (hasFirstParty && !hasThirdParty) {
        return 'first-party-only';
    } else if (hasThirdParty && !hasFirstParty) {
        return 'third-party-only';
    } else {
        return 'mixed';
    }
};
export const isBase64 = str => {
    if (str === '' || str.trim() === '') {
        return false;
    }
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
};

export const getStringHash = (algorithm, str) => {
    return crypto.createHash(algorithm).update(str).digest('hex');
};
export const getHashedValues = (algorithm, object) => {
    return Object.entries(object).reduce((acc, cur: any) => {
        acc[cur[0]] = algorithm === 'base64' ? Buffer.from(cur[1]).toString('base64') : getStringHash(algorithm, cur[1]);
        return acc;
    }, {});
};
