/* tslint:disable:only-arrow-functions */
export function instrumentNetworkRequestApis({ instrumentObject, instrumentFunctionViaProxy }) {
    window.fetch = instrumentFunctionViaProxy(window, 'window', 'fetch');
    instrumentObject(window.XMLHttpRequest.prototype, 'XMLHttpRequest');
}
