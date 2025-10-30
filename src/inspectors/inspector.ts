import { readFileSync } from 'fs';
import { Page } from 'puppeteer';
import { instrumentAddEventListener } from '../plugins/add-event-listener';
import { instrumentFingerprintingApis } from '../plugins/fingerprinting-apis';
import { jsInstruments } from '../plugins/js-instrument';
import { injectPlugins } from '../pptr-utils/eval-scripts';
import { BlacklightEvent } from '../types';

function getPageScriptAsString(observers, testing = false) {
    let observersString = '';
    let observersNameString = '';

    observers.forEach(obsv => {
        observersString += `${obsv}\n`;
        observersNameString += `${obsv.name},`;
    });
    return `${jsInstruments}\n${observersString}(${injectPlugins}(jsInstruments,[${observersNameString}],StackTrace,${testing ? 'true' : 'false'}))`;
}

export const setupBlacklightInspector = async (
    page: Page,
    eventDataHandler: (event: BlacklightEvent) => void,
    testing = false,
    plugins = [instrumentAddEventListener, instrumentFingerprintingApis]
) => {
    const stackTraceHelper = readFileSync(require.resolve('stacktrace-js/dist/stacktrace.js'), 'utf8');
    await page.evaluateOnNewDocument(stackTraceHelper); // inject stacktrace.js in the page context - for better stack traces/debugging
    await page.evaluateOnNewDocument(getPageScriptAsString(plugins, testing));

    await page.exposeFunction('reportEvent', eventData => {
        try {
            const parsed = JSON.parse(eventData);
            eventDataHandler(parsed);
        } catch (error) {
            eventDataHandler({
                data: {
                    message: JSON.stringify(eventData)
                },
                stack: [],
                type: `Error.BlacklightInspector`,
                url: ''
            });
        }
    });
};
