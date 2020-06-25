import { existsSync, readFileSync, writeFileSync } from "fs";
import flatten from "lodash.flatten";
import { join } from "path";
import { Page } from "puppeteer";
import { getDomain, getHostname } from "tldts";
import { Cookie } from "tough-cookie";
import { getScriptUrl } from "./utils";
const parseCookie = (cookieStr, fpUrl) => {
  const cookie = Cookie.parse(cookieStr);
  try {
    if (typeof cookie !== "undefined") {
      if (!!cookie.domain) {
        // what is the domain if not set explicitly?
        // https://stackoverflow.com/a/5258477/1407622
        cookie.domain = getHostname(fpUrl);
      }
      return cookie;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const setupHttpCookieCapture = async (page, eventHandler) => {
  await page.on("response", (response) => {
    try {
      const req = response.request();
      const cookieHTTP = response._headers["set-cookie"];
      if (cookieHTTP) {
        const stack = [
          {
            fileName: req.url(),
            source: `set in Set-Cookie HTTP response header for ${req.url()}`,
          },
        ];
        const splitCookieHeaders = cookieHTTP.split("\n");
        const data = splitCookieHeaders.map((c) => parseCookie(c, req.url()));
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
          url: frame.url(), // or page.url(), // (can be about:blank if the request is issued by browser.goto)
        });
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
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

export const getHTTPCookies = (events, url): any[] => {
  return flatten(
    events
      .filter((m) => m.type && m.type.includes("Cookie.HTTP"))
      .map((m) =>
        m.data
          .filter((c) => c)
          .map((d) => ({
            domain: d.hasOwnProperty("domain") ? d.domain : getHostname(url),
            name: d.key,
            path: d.path,
            script: getScriptUrl(m),
            type: "Cookie.HTTP",
            value: d.value,
          }))
      )
  );
};
export const getJsCookies = (events, url) => {
  return events
    .filter(
      (m) =>
        m.type &&
        m.type.includes("JsInstrument.ObjectProperty") &&
        m.data.symbol.includes("cookie") &&
        m.data.operation.startsWith("set") &&
        typeof Cookie.parse(m.data.value) !== "undefined"
    )
    .map((d) => {
      const data = parseCookie(d.data.value, url);
      const script = getScriptUrl(d);
      return {
        domain: d.hasOwnProperty("domain") ? d.domain : getHostname(url),
        name: data ? data.key : "",
        path: data ? data.path : "",
        script,
        type: d.type,
        value: data ? data.value : "",
      };
    });
};
export const matchCookiesToEvents = (cookies, events, url) => {
  const jsCookies = getJsCookies(events, url);
  const httpCookie = getHTTPCookies(events, url);

  if (cookies.length < 1) {
    const js = jsCookies
      .map((j) => ({
        ...j,
        third_party:
          getDomain(url) !== getDomain(`cookie://${j.domain}${j.path}`),
        type: "js",
      }))
      .filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) => t.name === thing.name && t.domain === thing.domain
            // t.value === thing.value
          )
      );
    const http = httpCookie
      .map((j) => ({
        ...j,
        third_party:
          getDomain(url) !== getDomain(`cookie://${j.domain}${j.path}`),
        type: "http",
      }))
      .filter(
        (thing, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.name === thing.name &&
              t.domain === thing.domain &&
              t.value === thing.value
          )
      );

    return [...js, ...http];
  }
  const final = cookies.map((b) => {
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
      // console.log(`${JSON.stringify(b)} found in http and js instruments`);
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
  ).cookies.map((cookie) => {
    if (cookie.expires > -1) {
      // add derived attributes for convenience
      cookie.expires = new Date(cookie.expires * 1000);
      // cookie.expiresDays =
      //   Math.round((cookie.expiresUTC - Date.now()) / (10 * 60 * 60 * 24)) /
      //   100;
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
    // tslint:disable-next-line:no-console
    console.log(error);
    // tslint:disable-next-line:no-console
    console.log("Couldnt save browser cookies to file");
  }
  return browser_cookies;
};

export const loadBrowserCookies = (
  dataDir,
  filename = "browser-cookies.json"
) => {
  try {
    if (existsSync(join(dataDir, filename))) {
      const cookies = JSON.parse(
        readFileSync(join(dataDir, filename), "utf-8")
      );
      return cookies.browser_cookies || [];
    } else {
      return [];
    }
  } catch (error) {
    // tslint:disable:no-console
    console.log("Couldnt load browser cookies");
    console.log(error);
    return [];
  }
};
