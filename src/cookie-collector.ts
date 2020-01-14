import { readFileSync, writeFileSync } from "fs";
import { flatten } from "lodash";
import { join } from "path";
import { Page } from "puppeteer";
import { getDomain, getHostname } from "tldts";
import { Cookie } from "tough-cookie";
import { getScriptUrl } from "./utils";
const parseCookie = (cookieStr, fpUrl) => {
  const cookie = Cookie.parse(cookieStr);
  if (!!cookie.domain) {
    // what is the domain if not set explicitly?
    // https://stackoverflow.com/a/5258477/1407622
    cookie.domain = getHostname(fpUrl);
  }
  return cookie;
};

export const setupHttpCookieCapture = async (page, eventHandler) => {
  await page.on("response", response => {
    try {
      const req = response.request();
      const cookieHTTP = response._headers["set-cookie"];
      if (cookieHTTP) {
        const stack = [
          {
            fileName: req.url(),
            source: `set in Set-Cookie HTTP response header for ${req.url()}`
          }
        ];
        const splitCookieHeaders = cookieHTTP.split("\n");
        const data = splitCookieHeaders.map(parseCookie);
        // find mainframe
        let frame = response.frame();
        while (frame.parentFrame()) {
          frame = frame.parentFrame();
        }

        eventHandler({
          data,
          raw: cookieHTTP,
          stack,
          type: "Cookie.HTTP",
          url: frame.url() // or page.url(), // (can be about:blank if the request is issued by browser.goto)
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export const clearCookiesCache = async (page: Page) => {
  const client = await page.target().createCDPSession();
  await client.send("Network.clearBrowserCookies");
  await client.send("Network.clearBrowserCache");
  await client.detach();
};

export const getHTTPCookies = events => {
  return flatten(
    events
      .filter(m => m.type && m.type.includes("Cookie.HTTP"))
      .map(m =>
        m.data.map(d => ({
          domain: d.domain,
          name: d.key,
          path: d.path,
          script: getScriptUrl(m),
          type: "Cookie.HTTP",
          value: d.value
        }))
      )
  );
};
export const getJsCookies = (events, url) => {
  return events
    .filter(
      m =>
        m.type &&
        m.type.includes("JsInstrument.ObjectProperty") &&
        m.data.symbol.includes("cookie") &&
        m.data.operation.startsWith("set")
    )
    .map(d => {
      const data = parseCookie(d.data.value, url);
      const script = getScriptUrl(d);
      return {
        domain: data.domain,
        name: data.key,
        path: data.path,
        script,
        type: d.type,
        value: data.value
      };
    });
};
export const matchCookiesToEvents = (cookies, events, url) => {
  const jsCookies = getJsCookies(events, url);
  const httpCookie = getHTTPCookies(events);
  const final = cookies.map(b => {
    const h = httpCookie.find(
      (c: any) =>
        b.name === c.name && b.domain === c.domain && b.value === c.value
    );

    const j = jsCookies.find(
      (c: any) =>
        b.name === c.name && b.domain === c.domain && b.value === c.value
    );

    let type = "";
    if (typeof h !== "undefined" && typeof j !== "undefined") {
      console.log(`${JSON.stringify(b)} found in http and js instruments`);
      type = "both";
    } else if (typeof h !== "undefined") {
      type = "http";
    } else if (typeof j !== "undefined") {
      type = "js";
    } else {
      // console.log(
      //   `${JSON.stringify(b)} not found in http and js instruments    `
      // );
      type = "unknown";
    }

    const third_party =
      getDomain(url) === getDomain(`cookie://${b.domain}${b.path}`)
        ? false
        : true;
    return { ...b, type, third_party };
  });
  return final.sort((a, b) => b.expires - a.expires);
};

// NOTE: There is a bug in chrome that prevents us from catching all the cookies being set using its instrumentation
// https://blog.ermer.de/2018/06/11/chrome-67-provisional-headers-are-shown/
// The following call using the dev tools protocol ensures we get all the cookies even if we cant trace the source for each call
export const captureBrowserCookies = async (
  page,
  outDir,
  filename = "browser-cookies.json"
) => {
  const client = await page.target().createCDPSession();
  const browser_cookies = (
    await client.send("Network.getAllCookies")
  ).cookies.map(cookie => {
    if (cookie.expires > -1) {
      // add derived attributes for convenience
      cookie.expiresUTC = new Date(cookie.expires * 1000);
      cookie.expiresDays =
        Math.round((cookie.expiresUTC - Date.now()) / (10 * 60 * 60 * 24)) /
        100;
    }
    cookie.domain = cookie.domain.replace(/^\./, ""); // normalise domain value
    return cookie;
  });
  await client.detach();
  try {
    writeFileSync(
      join(outDir, filename),
      JSON.stringify({ browser_cookies }, null, 2)
    );
  } catch (error) {
    console.error(error);
    console.error("Couldnt save browser cookies to file");
  }
  return browser_cookies;
};

export const loadBrowserCookies = (
  dataDir,
  filename = "browser-cookies.json"
) => {
  try {
    const cookies = JSON.parse(readFileSync(join(dataDir, filename), "utf-8"))
      .browser_cookies;
    return cookies;
  } catch (error) {
    console.error("Couldnt load browser cookies");
    console.error(error);
  }
};

//   "name": "__cfduid",
//   "value": "d619058d0f43143f8671c02667c980a271576533986",
//   "domain": "propublica.org",
//   "path": "/",
//   "expires": 1579125986.439901,
//   "size": 51,
//   "httpOnly": true,
//   "secure": false,
//   "session": false,
//   "expiresUTC": "2020-01-15T22:06:26.439Z",
//   "expiresDays": 30,
//   "script",
//   "type": "http","js","unclear"
