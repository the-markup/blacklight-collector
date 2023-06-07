export function injectPlugins(
  jsInstruments: any,
  observerScripts: any,
  StackTraceJS: any,
  testing: boolean,
) {
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
    console.log(
      "Content-side javascript instrumentation started",
      new Date().toISOString(),
    );
  }

  for (const script of observerScripts) {
    console.log(`Initializing ${script.name ? script.name : "anonymous"}`);
    script({
      instrumentFunctionViaProxy,
      instrumentObject,
      instrumentObjectProperty,
    });
  }
}
