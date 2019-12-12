export interface Global {
  __DEV_SERVER__: string;
}

export type BlacklightEventType =
  | "AddEventListener"
  | "DataExfiltration"
  | "Error"
  | "Error.AddEventListener"
  | "Error.BlacklightInspector"
  | "Error.DataExfiltration"
  | "Error.JsInstrument"
  | "JsInstrument"
  | "JsInstrument.Debug"
  | "JsInstrument.Error"
  | "JsInstrument.Function"
  | "JsInstrument.FunctionProxy"
  | "JsInstrument.ObjectProperty"
  | "TrackingRequest";

export interface BlacklightEvent {
  type: BlacklightEventType;
  url: string;
  stack: any[];
  data: BlacklightData;
}

export type BlacklightData =
  | JsInstrumentData
  | DataExfiltrationData
  | AddEventListenerData
  | BlacklightError
  | TrackingRequestData;

export interface DataExfiltrationData {
  post_request_url: string;
  post_data: string;
  base_64: boolean;
  filter: string[];
}

export interface AddEventListenerData {
  name: string;
  event_group: string;
}
export interface JsInstrumentData {
  symbol: string;
  value: string;
  operation: string;
  arguments?: any[];
  logSettings?: any;
}

export interface TrackingRequestData {
  urls: string;
  query?: string | object;
  filter: string;
  listName: string;
}
export interface BlacklightError {
  message: any;
  objectName?: string;
  propertyName?: string;
  object?: string;
}

export interface LinkObject {
  href: string;
  innerHtml: string;
  innerText: string;
}
