export function instrumentBtoa({ instrumentFunctionViaProxy }) {
    window.btoa = instrumentFunctionViaProxy(window, 'window', 'btoa');
}
