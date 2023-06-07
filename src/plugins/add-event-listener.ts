export function instrumentAddEventListener({ instrumentFunctionViaProxy }) {
  document.addEventListener = instrumentFunctionViaProxy(
    document,
    "document",
    "addEventListener",
  );
  window.addEventListener = instrumentFunctionViaProxy(
    window,
    "window",
    "addEventListener",
  );
}
