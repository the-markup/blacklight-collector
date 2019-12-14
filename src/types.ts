export interface Global {
  __DEV_SERVER__: string;
}

export type BlacklightEvent =
  | JsInstrumentEvent
  | DataExfiltrationEvent
  | BlacklightErrorEvent
  | TrackingRequestEvent;

export interface DataExfiltrationEvent {
  type: "DataExfiltration";
  url: string;
  stack: any[];
  data: {
    post_request_url: string;
    post_data: string;
    base_64: boolean;
    filter: string[];
  };
}

export interface JsInstrumentEvent {
  type:
    | "JsInstrument"
    | "JsInstrument.Debug"
    | "JsInstrument.Error"
    | "JsInstrument.Function"
    | "JsInstrument.FunctionProxy"
    | "JsInstrument.ObjectProperty";
  url: string;
  stack: any[];
  data: {
    symbol: string;
    value: string;
    operation: string;
    arguments?: any[];
    logSettings?: any;
  };
}

export interface TrackingRequestEvent {
  type: "TrackingRequest";
  url: string;
  stack: any[];
  data: { query?: string | object; filter: string; listName: string };
}
export interface BlacklightErrorEvent {
  type:
    | "Error"
    | "Error.BlacklightInspector"
    | "Error.DataExfiltration"
    | "Error.JsInstrument";
  url: string;
  stack: any[];
  data: {
    message: any;
    objectName?: string;
    propertyName?: string;
    object?: string;
  };
}

export interface LinkObject {
  href: string;
  innerHtml: string;
  innerText: string;
}

export const BEHAVIOUR_TRACKING_EVENTS = {
  MOUSE: [
    "click",
    "mousedown",
    "mouseup",
    "mousemove",
    "select",
    "dblclick",
    "scroll"
  ],
  KEYBOARD: ["keydown", "keypress", "keyup", "input"],
  TOUCH: ["touchmove", "touchstart", "touchend", "touchcancel"],
  SENSOR: ["devicemotion", "deviceorientation", "orientationchange"]
};

export const FINGERPRINTABLE_WINDOW_APIS = {
  NAVIGATOR: [
    "window.navigator.appCodeName",
    "window.navigator.appName",
    "window.navigator.appVersion",
    "window.navigator.clipboard",
    "window.navigator.cookieEnabled",
    "window.navigator.doNotTrack",
    "window.navigator.geolocation",
    "window.navigator.language",
    "window.navigator.languages",
    "window.navigator.onLine",
    "window.navigator.platform",
    "window.navigator.product",
    "window.navigator.productSub",
    "window.navigator.userAgent",
    "window.navigator.vendorSub",
    "window.navigator.vendor"
  ],
  BATTERY: ["window.navigator.getBattery", "window.BatteryManager"],
  PLUGIN: ["window.navigator.plugins"],
  MEDIA_DEVICES: ["window.navigator.mediaDevices.enumerateDevices"],
  SCREEN: ["window.screen.pixelDepth", "window.screen.colorDepth"],
  MIME: ["window.navigator.mimeTypes"],
  AUDIO: [
    "AudioContext.createOscillator",
    "AudioContext.createAnalyser",
    "AudioContext.createBiquadFilter",
    "AudioContext.createBuffer",
    "AudioContext.createGain",
    "AudioContext.createScriptProcessor",
    "AudioContext.destination",
    "AnalyserNode.connect",
    "AnalyserNode.disconnect",
    "AnalyserNode.frequencyBinCount",
    "AnalyserNode.getFloatFrequencyData",
    "GainNode.connect",
    "GainNode.gain",
    "GainNode.disconnect",
    "OscillatorNode.type",
    "OscillatorNode.connect",
    "OscillatorNode.stop",
    "OscillatorNode.start",
    "ScriptProcessorNode.connect",
    "ScriptProcessorNode.onaudioprocess",
    "ScriptProcessorNode.disconnect"
  ],
  WEBRTC: ["RTCPeerConnection"],
  CANVAS: [
    "CanvasRenderingContext2D.getImageData",
    "CanvasRenderingContext2D.fillText",
    "CanvasRenderingContext2D.strokeText",
    "CanvasRenderingContext2D.save",
    "HTMLCanvasElement.toDataURL",
    "HTMLCanvasElement.addEventListener"
  ]
};
