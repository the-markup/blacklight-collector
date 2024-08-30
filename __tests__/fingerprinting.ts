import puppeteer, { Browser } from "puppeteer";
import { Global, JsInstrumentEvent } from "../src/types";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupBlacklightInspector } from "../src/inspectors/inspector";
import { getScriptUrl } from "../src/utils";
declare var global: Global;
let browser = {} as Browser;

beforeAll(async () => {
  browser = await puppeteer.launch(defaultPuppeteerBrowserOptions);
}, 60000);

afterAll(async () => {
  await browser.close();
}, 60000);

// Expected Navigator and Screen properties
// BuildId and oscpu are Firefox specific so removing them
//
const PROPERTIES = [
  "window.navigator.appCodeName",
  "window.navigator.appName",
  "window.navigator.appVersion",
  "window.navigator.cookieEnabled",
  "window.navigator.doNotTrack",
  "window.navigator.geolocation",
  "window.navigator.language",
  "window.navigator.languages",
  "window.navigator.mediaDevices.enumerateDevices",
  "window.navigator.onLine",
  "window.navigator.platform",
  "window.navigator.product",
  "window.navigator.productSub",
  "window.navigator.userAgent",
  "window.navigator.vendorSub",
  "window.navigator.vendor",
  "window.screen.pixelDepth",
  "window.screen.colorDepth",
  "window.screen.height",
  "window.screen.width",
];
const CANVAS_TEST_URL = `${global.__DEV_SERVER__}/canvas-fingerprinting.html`;
const CANVAS_CALLS = [
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillStyle",
    "set",
    "#f60",
    undefined,
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.textBaseline",
    "set",
    "alphabetic",
    undefined,
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.textBaseline",
    "set",
    "top",
    undefined,
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.font",
    "set",
    "14px 'Arial'",
    undefined,
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillStyle",
    "set",
    "#069",
    undefined,
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillStyle",
    "set",
    "rgba(102, 204, 0, 0.7)",
    undefined,
  ],
  [CANVAS_TEST_URL, "HTMLCanvasElement.getContext", "call", "{}", ["2d"]],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillRect",
    "call",
    undefined,
    [125, 1, 62, 20],
  ],
  [
    CANVAS_TEST_URL,
    "HTMLCanvasElement.toDataURL",
    "call",
    "data:image/png;base64,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",
    [],
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillText",
    "call",
    undefined,
    ["BrowserLeaks,com <canvas> 1.0", 4, 17],
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillText",
    "call",
    undefined,
    ["BrowserLeaks,com <canvas> 1.0", 2, 15],
  ],
];

const AUDIO_TEST_URL = `${global.__DEV_SERVER__}/audio-fingerprinting.html`;
const AUDIO_SYMBOLS = [
  "AudioContext.createOscillator",
  "AudioContext.createAnalyser",
  "AudioContext.createGain",
  "AudioContext.createScriptProcessor",
  "GainNode.gain",
  "OscillatorNode.type",
  "OscillatorNode.connect",
  "AnalyserNode.connect",
  "ScriptProcessorNode.connect",
  "AudioContext.destination",
  "GainNode.connect",
  "ScriptProcessorNode.onaudioprocess",
  "OscillatorNode.start",
  "AnalyserNode.frequencyBinCount",
  "AnalyserNode.getFloatFrequencyData",
  "AnalyserNode.disconnect",
  "ScriptProcessorNode.disconnect",
  "GainNode.disconnect",
  "OscillatorNode.stop",
];

const WEBRTC_TEST_URL = `${global.__DEV_SERVER__}/webrtc-localip.html`;
const WEBRTC_CALLS = [
  [
    WEBRTC_TEST_URL,
    "RTCPeerConnection.createOffer",
    "call",
    "{}",
    ["FUNCTION", "FUNCTION"],
  ],
  [WEBRTC_TEST_URL, "RTCPeerConnection.createDataChannel", "call", "{}", [""]],

  [
    WEBRTC_TEST_URL,
    "RTCPeerConnection.onicecandidate",
    "set",
    "FUNCTION",
    undefined,
  ],
];

//we expect these strings to be present in the WebRTC SDP
const WEBRTC_SDP_OFFER_STRINGS = [
  "a=ice-options",
  "o=mozilla...THIS_IS_SDPARTA",
  "IN IP4",
  "a=fingerprint:sha-256",
  "a=ice-options:",
  "a=msid-semantic",
  "m=application",
  "a=sendrecv",
  "a=ice-pwd:",
  "a=ice-ufrag:",
  "a=mid:0",
  "a=sctp-port:",
  "a=setup:",
];

describe("Blacklight Fingerprinting Inspector", () => {
  it("checks for available window properties", async () => {
    const PROPERTIES_URL = `${global.__DEV_SERVER__}/property-enumeration.html`;
    const rows = [];
    const eventDataHandler = (event) => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(PROPERTIES_URL, { waitUntil: "networkidle0" });
    const testData = [];
    rows.forEach((d: JsInstrumentEvent) => {
      const data = d.data;
      testData.push(data.symbol);
      expect(getScriptUrl(d)).toBe(PROPERTIES_URL);
    });
    await page.close();
    expect(testData.sort()).toEqual(PROPERTIES.sort());
  });

  it.skip("can instrument the canvas object", async () => {
    const rows = [];
    const eventDataHandler = (event) => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(CANVAS_TEST_URL, { waitUntil: "networkidle2" });
    const testData = [];
    rows.forEach((row) => {
      testData.push([
        getScriptUrl(row),
        row.data["symbol"],
        row.data["operation"],
        row.data["value"],
        row.data["arguments"],
      ]);
    });
    await page.close();
    expect(testData.sort()).toEqual(CANVAS_CALLS.sort());
  });
  it("can instrument the webaudio object", async () => {
    const rows = [];
    const eventDataHandler = (event) => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(AUDIO_TEST_URL, { waitUntil: "networkidle0" });
    const testData = new Set();

    rows.forEach((row) => {
      testData.add(row.data["symbol"]);
    });
    await page.close();
    expect([...testData]).toEqual([...AUDIO_SYMBOLS]);
  });
  it("can instrument webrtc", async () => {
    const rows = [];
    const eventDataHandler = (event) => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(WEBRTC_TEST_URL, { waitUntil: "networkidle0" });
    const testData = new Set();
    rows.forEach((row) => {
      if (
        row.data["symbol"] === "RTCPeerConnection.setLocalDescription" &&
        row.data["operation"] === "call"
      ) {
        const sdp_offer = JSON.parse(row.data["arguments"][0]).sdp;

        expect(
          WEBRTC_SDP_OFFER_STRINGS.map((w) => sdp_offer.indexOf(w) > -1)
        ).toContain(true);
      } else {
        testData.add([
          getScriptUrl(row),
          row.data["symbol"],
          row.data["operation"],
          row.data["value"],
          row.data["arguments"],
        ]);
      }
    });
    await page.close();
    expect([...testData].sort()).toEqual([...WEBRTC_CALLS].sort());
  });
});
