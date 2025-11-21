export interface Global {
    __DEV_SERVER__: string;
}

export type BlacklightEvent = 
    JsInstrumentEvent | 
    KeyLoggingEvent | 
    BlacklightErrorEvent | 
    TrackingRequestEvent | 
    SessionRecordingEvent;

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
    data: { query?: any; body?: any, filter: string; listName: string };
}
interface BlacklightErrorEvent {
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

type ScriptUrl = string;
type CanvasCallValue = string;
export type CanvasCallMap = Map<ScriptUrl, Set<CanvasCallValue>>;

export interface TikTokContext {
    page?: { url?: string };
    device?: Record<string, string>;
    user?: Record<string, string>;
}
