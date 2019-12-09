export interface Global {
  __DEV_SERVER__: string;
}

type BlacklightEventType =
  | "AddEventListener"
  | "DataExfiltration"
  | "Error"
  | "Error.BlacklightInspector"
  | "Error.AddEventListener"
  | "Error.DataExfiltration"
  | "Error.JsInstrument"
  | "JsInstrument.Debug"
  | "JsInstrument.Error"
  | "JsInstrument.Function"
  | "JsInstrument.FunctionProxy"
  | "JsInstrument.ObjectProperty";

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
  | BlacklightError;

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
