import { BlacklightEvent } from "../inspector";
declare global {
  interface Object {
    getPropertyDescriptor(subject: any, name: any): PropertyDescriptor;
  }

  interface Object {
    getPropertyNames(subject: any): string[];
  }
}
interface LogSettings {
  propertiesToInstrument?: string[];
  excludedProperties?: string[];
  logCallStack?: boolean;
  logFunctionsAsStrings?: boolean;
  preventSets?: boolean;
  recursive?: boolean;
  depth?: number;
}
export function jsInstruments(loggerHandler, StackTrace) {
  let inLog = false;
  const sendMessagesToLogger = (msg: BlacklightEvent) => {
    if (inLog) return;
    loggerHandler(msg);
    inLog = false;
  };
  const instrumentFunctionViaProxy = function(
    object: any,
    objectName: string,
    property: string
  ) {
    return new Proxy(object[property], {
      apply: function(target, thisValue, args) {
        const stack = StackTrace.getSync({ offline: true });
        sendMessagesToLogger({
          type: "JsInstrument.FunctionProxy",
          url: window.location.href,
          stack: stack.slice(1, 3),
          data: {
            symbol: `${objectName}.${property}`,
            value: serializeObject(args, true),
            operation: "call"
          }
        });
        return target.call(thisValue, ...args);
      }
    });
  };
  // Recursively generates a path for an element
  const getPathToDomElement = function(element, visibilityAttr = false) {
    if (element === document.body) {
      return element.tagName;
    }
    if (element.parentNode === null) {
      return "NULL/" + element.tagName;
    }

    let siblingIndex = 1;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        let path = getPathToDomElement(element.parentNode, visibilityAttr);
        path += "/" + element.tagName + "[" + siblingIndex;
        path += "," + element.id;
        path += "," + element.className;
        if (visibilityAttr) {
          path += "," + element.hidden;
          path += "," + element.style.display;
          path += "," + element.style.visibility;
        }
        if (element.tagName === "A") {
          path += "," + element.href;
        }
        path += "]";
        return path;
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        siblingIndex++;
      }
    }
  };
  const serializeObject = function(object, stringifyFunctions = false) {
    // Handle permissions errors
    try {
      if (object === null) {
        return "null";
      }
      if (typeof object === "function") {
        if (stringifyFunctions) {
          return object.toString();
        } else {
          return "FUNCTION";
        }
      }
      if (typeof object !== "object") {
        return object;
      }
      const seenObjects = [];
      return JSON.stringify(object, function(key, value) {
        if (value === null) {
          return "null";
        }
        if (typeof value === "function") {
          if (stringifyFunctions) {
            return value.toString();
          } else {
            return "FUNCTION";
          }
        }
        if (typeof value === "object") {
          // Remove wrapping on content objects
          if ("wrappedJSObject" in value) {
            value = value.wrappedJSObject;
          }

          // Serialize DOM elements
          if (value instanceof HTMLElement) {
            return getPathToDomElement(value);
          }

          // Prevent serialization cycles
          if (key === "" || seenObjects.indexOf(value) < 0) {
            seenObjects.push(value);
            return value;
          } else {
            return typeof value;
          }
        }
        return value;
      });
    } catch (error) {
      sendMessagesToLogger({
        type: "JsInstrument.Error",
        url: window.location.href,
        stack: [],
        data: {
          message: `Serialization error: ${error}`
        }
      });

      return "Serialization error: " + error;
    }
  };

  Object.getPropertyDescriptor = function(subject, name) {
    let pd = Object.getOwnPropertyDescriptor(subject, name);
    let proto = Object.getPrototypeOf(subject);
    while (pd === undefined && proto !== null) {
      pd = Object.getOwnPropertyDescriptor(proto, name);
      proto = Object.getPrototypeOf(proto);
    }
    return pd ? pd : {};
  };

  Object.getPropertyNames = function(subject) {
    let props = Object.getOwnPropertyNames(subject);
    let proto = Object.getPrototypeOf(subject);
    while (proto !== null) {
      props = props.concat(Object.getOwnPropertyNames(proto));
      proto = Object.getPrototypeOf(proto);
    }
    // FIXME: remove duplicate property names from props
    return props;
  };
  const isObject = function(object, propertyName) {
    let property;
    try {
      property = object[propertyName];
    } catch (error) {
      return false;
    }
    if (property === null) {
      // null is type "object"
      return false;
    }
    return typeof property === "object";
  };

  const instrumentFunction = function(
    objectName,
    methodName,
    func,
    serialize = false
  ) {
    return function() {
      const stack = StackTrace.getSync({ offline: true });
      const args = Array.prototype.slice.call(arguments, 0);
      const serialArgs = args.map(arg => serializeObject(arg, serialize));
      sendMessagesToLogger({
        type: "JsInstrument.Function",
        url: window.location.href,
        stack: stack.slice(1, 3),
        data: {
          operation: "call",
          value: "",
          symbol: `${objectName}.${methodName}`,
          arguments: serialArgs
        }
      });
      return func.apply(this, arguments);
    };
  };

  const instrumentObjectProperty = function(
    object,
    objectName,
    propertyName,
    logSettings: LogSettings = {}
  ) {
    console.log(objectName, propertyName);
    const origDescriptor = Object.getPropertyDescriptor(object, propertyName);
    if (!origDescriptor) {
      sendMessagesToLogger({
        type: "Error.JsInstrument",
        url: window.location.href,
        stack: [],
        data: {
          message: "Property descriptor not found for",
          objectName,
          propertyName,
          object
        }
      });
      return;
    }
    const origGetter = origDescriptor.get;
    const origSetter = origDescriptor.set;
    let originalValue = origDescriptor.value;
    Object.defineProperty(object, propertyName, {
      configurable: true,
      get() {
        let origProperty;
        const stack = StackTrace.getSync({ offline: true });
        if (origGetter) {
          // if accessor property
          origProperty = origGetter.call(this);
        } else if ("value" in origDescriptor) {
          // if data property
          origProperty = originalValue;
        } else {
          console.error(
            `Property descriptor for ${objectName}.${propertyName} doesn't have getter or value?`
          );

          sendMessagesToLogger({
            type: "JsInstrument.ObjectProperty",
            url: window.location.href,
            stack: stack,
            data: {
              symbol: objectName + "." + propertyName,
              value: "",
              operation: "get(failed)",
              logSettings
            }
          });
          return;
        }
        // Log `gets` except those that have instrumented return values
        // * All returned functions are instrumented with a wrapper
        // * Returned objects may be instrumented if recursive
        //   instrumentation is enabled and this isn't at the depth limit.
        if (typeof origProperty === "function") {
          return instrumentFunction(objectName, propertyName, origProperty);
        } else if (
          typeof origProperty === "object" &&
          !!logSettings.recursive &&
          (!("depth" in logSettings) || logSettings.depth > 0)
        ) {
          return origProperty;
        } else {
          sendMessagesToLogger({
            type: "JsInstrument.ObjectProperty",
            url: window.location.href,
            stack: stack.slice(1, 3),
            data: {
              symbol: `${objectName}.${propertyName}`,
              value: serializeObject(origProperty),
              operation: "get"
            }
          });
          return origProperty;
        }
      },
      set(value) {
        let returnValue;
        const stack = StackTrace.getSync({ offline: true });
        // Prevent sets for functions and objects if enabled
        if (
          !!logSettings.preventSets &&
          (typeof originalValue === "function" ||
            typeof originalValue === "object")
        ) {
          sendMessagesToLogger({
            type: "JsInstrument.ObjectProperty",
            url: window.location.href,
            stack: stack.slice(1, 3),
            data: {
              symbol: `${objectName}.${propertyName}`,
              value: serializeObject(value),
              operation: "set(prevented)"
            }
          });
          return value;
        }
        if (origSetter) {
          // if accessor property
          returnValue = origSetter.call(this, value);
        } else if ("value" in origDescriptor) {
          inLog = true;
          if (object.isPrototypeOf(this)) {
            Object.defineProperty(this, propertyName, {
              value
            });
          } else {
            originalValue = value;
          }
          returnValue = value;
          inLog = false;
        } else {
          sendMessagesToLogger({
            type: "Error.JsInstrument",
            url: window.location.href,
            stack: stack.slice(1, 3),
            data: {
              message: `Property descriptor for, ${objectName}.${propertyName}, doesn't have setter or value?`
            }
          });

          return value;
        }
        sendMessagesToLogger({
          type: "JsInstrument.ObjectProperty",
          url: window.location.href,
          stack: stack.slice(1, 3),
          data: {
            symbol: `${objectName}.${propertyName}`,
            value: serializeObject(value),
            operation: "set"
          }
        });
        return returnValue;
      }
    });
  };
  const instrumentObject = function(
    object,
    objectName,
    logSettings: LogSettings = {}
  ) {
    // sendMessagesToLogger({ type: "JsInstrument.Debug", message: !!logSettings.recursive });
    const properties = Object.getPropertyNames(object);
    for (const property of properties) {
      if (
        logSettings.excludedProperties &&
        logSettings.excludedProperties.indexOf(property) > -1
      ) {
        console.log("skipping", property);
        continue;
      }
      // console.log("observing", property);
      // If `recursive` flag set we want to recursively instrument any
      // object properties that aren't the prototype object. Only recurse if
      // depth not set (at which point its set to default) or not at limit.
      if (
        !!logSettings.recursive &&
        property !== "__proto__" &&
        isObject(object, property) &&
        (!("depth" in logSettings) || logSettings.depth > 0)
      ) {
        if (!("depth" in logSettings)) {
          logSettings.depth = 5;
        }
        instrumentObject(object[property], `${objectName}.${property}`, {
          depth: logSettings.depth - 1,
          preventSets: logSettings.preventSets,
          recursive: logSettings.recursive
        });
      }
      try {
        instrumentObjectProperty(object, objectName, property, logSettings);
      } catch (error) {
        sendMessagesToLogger({
          type: "Error.JsInstrument",
          url: window.location.href,
          stack: [],
          data: {
            message: error
          }
        });
        console.log(error);
      }
    }
  };
  return {
    instrumentFunctionViaProxy,
    instrumentObject,
    instrumentObjectProperty
  };
}
