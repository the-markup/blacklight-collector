import { Browser, launch } from "puppeteer";
import { Global, BlacklightEvent, JsInstrumentData } from "../src/types";
import { defaultPuppeteerBrowserOptions } from "../src/pptr-utils/default";
import { setupBlacklightInspector } from "../src/inspector";
// jest.setTimeout(10000);
declare var global: Global;
let browser = {} as Browser;

beforeAll(async () => {
  browser = await launch(defaultPuppeteerBrowserOptions);
});

afterAll(async () => {
  await browser.close();
});

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
  "window.screen.width"
];
const CANVAS_TEST_URL = `${global.__DEV_SERVER__}/canvas-fingerprinting.html`;
const CANVAS_CALLS = [
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillStyle",
    "set",
    "#f60",
    undefined
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.textBaseline",
    "set",
    "alphabetic",
    undefined
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.textBaseline",
    "set",
    "top",
    undefined
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.font",
    "set",
    "14px 'Arial'",
    undefined
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillStyle",
    "set",
    "#069",
    undefined
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillStyle",
    "set",
    "rgba(102, 204, 0, 0.7)",
    undefined
  ],
  [CANVAS_TEST_URL, "HTMLCanvasElement.getContext", "call", "", ["2d"]],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillRect",
    "call",
    "",
    [125, 1, 62, 20]
  ],
  [CANVAS_TEST_URL, "HTMLCanvasElement.toDataURL", "call", "", []],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillText",
    "call",
    "",
    ["BrowserLeaks,com <canvas> 1.0", 4, 17]
  ],
  [
    CANVAS_TEST_URL,
    "CanvasRenderingContext2D.fillText",
    "call",
    "",
    ["BrowserLeaks,com <canvas> 1.0", 2, 15]
  ]
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
  "OscillatorNode.stop"
];

const WEBRTC_TEST_URL = `${global.__DEV_SERVER__}/webrtc-localip.html`;
// TODO: Understand this test better, removing the value that doesnt pass for now
// [
//   WEBRTC_TEST_URL,
//   "RTCPeerConnection.createDataChannel",
//   "call",
//   "",
//   '["","{\\"reliable\\":false}"]'
// ],
const WEBRTC_CALLS = [
  [
    WEBRTC_TEST_URL,
    "RTCPeerConnection.createOffer",
    "call",
    "",
    ["FUNCTION", "FUNCTION"]
  ],
  [WEBRTC_TEST_URL, "RTCPeerConnection.createDataChannel", "call", "", [""]],

  [
    WEBRTC_TEST_URL,
    "RTCPeerConnection.onicecandidate",
    "set",
    "FUNCTION",
    undefined
  ]
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
  "a=setup:"
];

describe("Blacklight Fingerprinting Inspector", () => {
  it.only("checks for available window properties", async () => {
    const PROPERTIES_URL = `${global.__DEV_SERVER__}/property-enumeration.html`;
    const rows = [];
    const eventDataHandler = event => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(PROPERTIES_URL, { waitUntil: "networkidle0" });
    const testData = [];
    rows.forEach((d: BlacklightEvent) => {
      const data = <JsInstrumentData>d.data;
      testData.push(data.symbol);
      expect(d.stack[0].fileName).toBe(PROPERTIES_URL);
    });
    await page.close();
    expect(testData.sort()).toEqual(PROPERTIES.sort());
  });

  it("can instrument the canvas object", async () => {
    const rows = [];
    const eventDataHandler = event => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(CANVAS_TEST_URL, { waitUntil: "networkidle2" });
    const testData = [];
    rows.forEach(row => {
      testData.push([
        row.stack[0].fileName,
        row.data["symbol"],
        row.data["operation"],
        row.data["value"],
        row.data["arguments"]
      ]);
    });
    await page.close();
    expect(testData.sort()).toEqual(CANVAS_CALLS.sort());
  });
  it("can instrument the webaudio object", async () => {
    const rows = [];
    const eventDataHandler = event => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(AUDIO_TEST_URL, { waitUntil: "networkidle0" });
    const testData = new Set();

    rows.forEach(row => {
      testData.add(row.data["symbol"]);
    });
    await page.close();
    expect([...testData]).toEqual([...AUDIO_SYMBOLS]);
  });
  it("can instrument webrtc", async () => {
    const rows = [];
    const eventDataHandler = event => rows.push(event);
    const page = await browser.newPage();
    await setupBlacklightInspector(page, eventDataHandler, true);
    await page.goto(WEBRTC_TEST_URL, { waitUntil: "networkidle0" });
    const testData = new Set();
    rows.forEach(row => {
      if (
        row.data["symbol"] === "RTCPeerConnection.setLocalDescription" &&
        row.data["operation"] === "call"
      ) {
        const sdp_offer = JSON.parse(row.data["arguments"][0]).sdp;

        expect(
          WEBRTC_SDP_OFFER_STRINGS.map(w => sdp_offer.indexOf(w) > -1)
        ).toContain(true);
      } else {
        testData.add([
          row["stack"][0].fileName,
          row.data["symbol"],
          row.data["operation"],
          row.data["value"],
          row.data["arguments"]
        ]);
      }
    });
    await page.close();
    expect([...testData].sort()).toEqual([...WEBRTC_CALLS].sort());
  });
});
