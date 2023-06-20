export interface Global {
    __DEV_SERVER__: string;
}

export type BlacklightEvent = JsInstrumentEvent | KeyLoggingEvent | BlacklightErrorEvent | TrackingRequestEvent | SessionRecordingEvent;

export interface KeyLoggingEvent {
    type: 'KeyLogging';
    url: string;
    stack: any[];
    data: {
        post_request_url: string;
        post_data: string;
        match_type: string[];
        filter: string[];
    };
}

export interface JsInstrumentEvent {
    type:
        | 'JsInstrument'
        | 'JsInstrument.Debug'
        | 'JsInstrument.Error'
        | 'JsInstrument.Function'
        | 'JsInstrument.FunctionProxy'
        | 'JsInstrument.ObjectProperty';
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

export interface SessionRecordingEvent {
    type: 'SessionRecording';
    url: string;
    matches: string[];
    stack: any[];
}
export interface TrackingRequestEvent {
    type: 'TrackingRequest';
    url: string;
    stack: any[];
    data: { query?: any; filter: string; listName: string };
}
export interface BlacklightErrorEvent {
    type: 'Error' | 'Error.BlacklightInspector' | 'Error.KeyLogging' | 'Error.JsInstrument';
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
export const SESSION_RECORDERS_LIST = [
    'mc.yandex.ru/metrika/watch.js',
    'mc.yandex.ru/metrika/tag.js',
    'mc.yandex.ru/webvisor/',
    'fullstory.com/s/fs.js',
    'd2oh4tlt9mrke9.cloudfront.net/Record/js/sessioncam.recorder.js',
    'ws.sessioncam.com/Record/record.asmx',
    'userreplay.net',
    'static.hotjar.com',
    'script.hotjar.com',
    'insights.hotjar.com/api',
    'clicktale.net',
    'smartlook.com',
    'decibelinsight.net',
    'quantummetric.com',
    'inspectlet.com',
    'mouseflow.com',
    'logrocket.com',
    'salemove.com',
    'd10lpsik1i8c69.cloudfront.net',
    'luckyorange.com',
    'vwo.com',
    'clarity.ms'
];
export const BEHAVIOUR_TRACKING_EVENTS = {
    KEYBOARD: ['keydown', 'keypress', 'keyup', 'input'],
    MOUSE: ['click', 'mousedown', 'mouseup', 'mousemove', 'select', 'dblclick', 'scroll'],
    SENSOR: ['devicemotion', 'deviceorientation', 'orientationchange'],
    TOUCH: ['touchmove', 'touchstart', 'touchend', 'touchcancel']
};

export const FINGERPRINTABLE_WINDOW_APIS = {
    AUDIO: [
        'AudioContext.createOscillator',
        'AudioContext.createAnalyser',
        'AudioContext.createBiquadFilter',
        'AudioContext.createBuffer',
        'AudioContext.createGain',
        'AudioContext.createScriptProcessor',
        'AudioContext.destination',
        'AnalyserNode.connect',
        'AnalyserNode.disconnect',
        'AnalyserNode.frequencyBinCount',
        'AnalyserNode.getFloatFrequencyData',
        'GainNode.connect',
        'GainNode.gain',
        'GainNode.disconnect',
        'OscillatorNode.type',
        'OscillatorNode.connect',
        'OscillatorNode.stop',
        'OscillatorNode.start',
        'ScriptProcessorNode.connect',
        'ScriptProcessorNode.onaudioprocess',
        'ScriptProcessorNode.disconnect'
    ],
    BATTERY: ['window.BatteryManager', 'window.navigator.getBattery'],
    CANVAS: [
        'CanvasRenderingContext2D.getImageData',
        'CanvasRenderingContext2D.fillText',
        'CanvasRenderingContext2D.strokeText',
        'CanvasRenderingContext2D.save',
        'HTMLCanvasElement.toDataURL',
        'HTMLCanvasElement.addEventListener'
    ],
    MEDIA_DEVICES: ['window.navigator.mediaDevices.enumerateDevices'],
    MIME: ['window.navigator.mimeTypes'],
    NAVIGATOR: [
        'window.navigator.appCodeName',
        'window.navigator.appName',
        'window.navigator.appVersion',
        'window.navigator.clipboard',
        'window.navigator.cookieEnabled',
        'window.navigator.doNotTrack',
        'window.navigator.geolocation',
        'window.navigator.language',
        'window.navigator.languages',
        'window.navigator.onLine',
        'window.navigator.platform',
        'window.navigator.product',
        'window.navigator.productSub',
        'window.navigator.userAgent',
        'window.navigator.vendorSub',
        'window.navigator.vendor'
    ],
    PLUGIN: ['window.navigator.plugins'],
    SCREEN: ['window.screen.pixelDepth', 'window.screen.colorDepth'],
    WEBRTC: ['RTCPeerConnection']
};
