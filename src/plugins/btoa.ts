/* tslint:disable:only-arrow-functions */
export function instrumentBtoa({ instrumentFunctionViaProxy }) {
    window.btoa = instrumentFunctionViaProxy(window, 'window', 'btoa');
}
