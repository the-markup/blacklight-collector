// tslint:disable-next-line:only-arrow-functions
export function injectPlugins(
  jsInstruments: any,
  observerScripts: any,
  StackTraceJS: any,
  testing: boolean,
) {
  // tslint:disable-next-line:only-arrow-functions
  function sendMessagesToLogger(messages: any) {
    (window as any).reportEvent(JSON.stringify(messages));
  }
  // WARN: This script makes the assumption that you have injected StackTrace js to the page context
  const {
    instrumentFunctionViaProxy,
    instrumentObject,
    instrumentObjectProperty,
  } = jsInstruments(sendMessagesToLogger, StackTraceJS);
  if (testing) {
    (window as any).instrumentFunctionViaProxy = instrumentFunctionViaProxy;
    (window as any).instrumentObject = instrumentObject;
    (window as any).instrumentObjectProperty = instrumentObjectProperty;
    // tslint:disable-next-line:no-console
    console.log(
      "Content-side javascript instrumentation started",
      new Date().toISOString(),
    );
  }

  for (const script of observerScripts) {
    // tslint:disable-next-line:no-console
    console.log(`Initializing ${script.name ? script.name : "anonymous"}`);
    script({
      instrumentFunctionViaProxy,
      instrumentObject,
      instrumentObjectProperty,
    });
  }
}
