import { getDomain } from 'tldts';
import { getCanvasFontFingerprinters, getCanvasFingerprinters } from './canvas-fingerprinting';
import { loadBrowserCookies, matchCookiesToEvents } from './inspectors/cookies';
import { 
    BEHAVIOUR_TRACKING_EVENTS, 
    FINGERPRINTABLE_WINDOW_APIS, 
    FB_ADVANCED_MATCHING_PARAMETERS, 
    FB_STANDARD_EVENTS,
} from './helpers/statics';
import {
    BlacklightEvent,
    JsInstrumentEvent,
    KeyLoggingEvent,
    SessionRecordingEvent,
    TrackingRequestEvent,
} from './types';
import { 
    getScriptUrl, 
    groupBy, 
    loadJSONSafely, 
    hasOwnProperty, 
} from './utils';

export const generateReport = (reportType, messages, dataDir, url) => {
    const eventData = getEventData(reportType, messages);
    switch (reportType) {
        case 'cookies':
            return reportCookieEvents(eventData, dataDir, url);
        case 'key_logging':
            return reportKeyLogging(eventData);
        case 'behaviour_event_listeners':
            return reportEventListeners(eventData);
        case 'canvas_fingerprinters':
            return reportCanvasFingerprinters(eventData);
        case 'canvas_font_fingerprinters':
            return reportCanvasFontFingerprinters(eventData);
        case 'fb_pixel_events':
            return reportFbPixelEvents(eventData);
        case 'fingerprintable_api_calls':
            return reportFingerprintableAPIs(eventData);
        case 'session_recorders':
            return reportSessionRecorders(eventData);
        case 'third_party_trackers':
            return reportThirdPartyTrackers(eventData, url);
        default:
            return {};
    }
};

const filterByEvent = (messages, typePattern) => {
    return messages.filter(m => m.message.type.includes(typePattern) && !m.message.type.includes('Error'));
};

const getEventData = (reportType, messages): BlacklightEvent[] => {
    let filtered = [];
    switch (reportType) {
        case 'cookies':
            filtered = filterByEvent(messages, 'JsInstrument');
            filtered = filtered.concat(filterByEvent(messages, 'Cookie.HTTP'));
            break;
        case 'key_logging':
            filtered = filterByEvent(messages, 'KeyLogging');
            break;
        case 'behaviour_event_listeners':
            filtered = filterByEvent(messages, 'JsInstrument');
            break;
        case 'canvas_fingerprinters':
            filtered = filterByEvent(messages, 'JsInstrument');
            break;
        case 'canvas_font_fingerprinters':
            filtered = filterByEvent(messages, 'JsInstrument');
            break;
        case 'fingerprintable_api_calls':
            filtered = filterByEvent(messages, 'JsInstrument');
            break;
        case 'session_recorders':
            filtered = filterByEvent(messages, 'SessionRecording');
            break;
        case 'third_party_trackers':
            filtered = filterByEvent(messages, 'TrackingRequest');
            break;
        case 'fb_pixel_events':
            filtered = filterByEvent(messages, 'TrackingRequest');
            break;
        default:
            return [];
    }
    return filtered.map(m => m.message);
};

const reportSessionRecorders = (eventData: BlacklightEvent[]) => {
    const report = {};
    eventData.forEach((event: SessionRecordingEvent) => {
        const match = event.matches[0];
        if (Object.keys(report).includes(match) && !report[match].includes(event.url)) {
            report[match].push(event.url);
        } else {
            report[match] = [event.url];
        }
    });
    return report;
};

const MONITORED_EVENTS = [].concat(...Object.values(BEHAVIOUR_TRACKING_EVENTS));
const reportEventListeners = (eventData: BlacklightEvent[]) => {
    const parsedEvents = [];
    eventData.forEach((event: JsInstrumentEvent) => {
        const data = event.data;
        if (data.symbol.indexOf('addEventListener') > -1) {
            const values = loadJSONSafely(data.value);
            if (Array.isArray(values) && MONITORED_EVENTS.includes(values[0])) {
                const eventGroup = Object.keys(BEHAVIOUR_TRACKING_EVENTS).filter(key => BEHAVIOUR_TRACKING_EVENTS[key].includes(values[0]));
                parsedEvents.push({
                    data: {
                        event_group: eventGroup.length ? eventGroup[0] : '',
                        name: values[0]
                    },
                    stack: event.stack,
                    url: event.url
                });
            }
        }
    });
    const output = parsedEvents.reduce((acc, cur) => {
        const script = getScriptUrl(cur as BlacklightEvent);
        const data = cur.data;
        if (!script) {
            return acc;
        }

        if (hasOwnProperty(acc, data.event_group)) {
            if (hasOwnProperty(acc[data.event_group], script)) {
                acc[data.event_group][script].add(data.name);
            } else {
                acc[data.event_group][script] = new Set([data.name]);
            }
        } else {
            acc[data.event_group] = { [script]: new Set([data.name]) };
        }
        return acc;
    }, {});

    const serializable = {};
    for (const [event_group, script_obj] of Object.entries(output)) {
        serializable[event_group] = {};
        for (const [script, events] of Object.entries(script_obj)) {
            serializable[event_group][script] = Array.from(events as any);
        }
    }
    return serializable;
};

export const reportCanvasFingerprinters = (eventData: BlacklightEvent[]) => {
    return getCanvasFingerprinters(eventData);
};

export const reportCanvasFontFingerprinters = (eventData: BlacklightEvent[]) => {
    return getCanvasFontFingerprinters(eventData);
};

export const reportCookieEvents = (eventData: BlacklightEvent[], dataDir, url) => {
    const browser_cookies = loadBrowserCookies(dataDir);
    return matchCookiesToEvents(browser_cookies, eventData, url);
};

const reportKeyLogging = (eventData: BlacklightEvent[]) => {
    const groupByRequestPs = groupBy('post_request_ps');
    return groupByRequestPs(
        eventData.map((m: KeyLoggingEvent) => ({
            ...m.data,
            post_request_ps: getDomainSafely(m)
        }))
    );
};

const WINDOW_FP_LIST = [].concat(...Object.values(FINGERPRINTABLE_WINDOW_APIS));
const reportFingerprintableAPIs = (eventData: BlacklightEvent[]) => {
    const parsedEvents = [];
    eventData.forEach((event: JsInstrumentEvent) => {
        const data = event.data;
        if (WINDOW_FP_LIST.includes(data.symbol)) {
            const windowApiGroup = Object.keys(FINGERPRINTABLE_WINDOW_APIS).filter(key => FINGERPRINTABLE_WINDOW_APIS[key].includes(data.symbol));
            parsedEvents.push({
                api_group: windowApiGroup[0],
                stack: event.stack,
                symbol: data.symbol
            });
        }
    });
    const output = parsedEvents.reduce((acc, cur) => {
        const script = getScriptUrl(cur as BlacklightEvent);
        if (!script) {
            return acc;
        }

        if (hasOwnProperty(acc, cur.api_group)) {
            if (hasOwnProperty(acc[cur.api_group], script)) {
                acc[cur.api_group][script].add(cur.symbol);
            } else {
                acc[cur.api_group][script] = new Set([cur.symbol]);
            }
        } else {
            acc[cur.api_group] = { [script]: new Set([cur.symbol]) };
        }
        return acc;
    }, {});

    const serializable = {};
    for (const [api_group, script_obj] of Object.entries(output)) {
        serializable[api_group] = {};
        for (const [script, events] of Object.entries(script_obj)) {
            serializable[api_group][script] = Array.from(events as any);
        }
    }
    return serializable;
};

const reportThirdPartyTrackers = (eventData: BlacklightEvent[], fpDomain) => {
    return eventData.filter(e => {
        const requestDomain = getDomain(e.url);
        const isThirdPartyDomain = requestDomain && requestDomain !== fpDomain;
        return isThirdPartyDomain;
    });
};

const reportFbPixelEvents = (eventData: BlacklightEvent[]) => {
    const events = eventData.filter(
        (e: TrackingRequestEvent) =>
            e.url.includes('facebook') && e.data.query && Object.keys(e.data.query).includes('ev') && e.data.query.ev !== 'Microdata'
    );
    const advancedMatchingParams = [];
    const dataParams = [];
    return events.map((e: TrackingRequestEvent) => {
        let eventName = '';
        let eventDescription = '';
        let pageUrl = '';
        let isStandardEvent = false;
        for (const [key, value] of Object.entries(e.data.query)) {
            if (key === 'dl') {
                pageUrl = value as string;
            }
            if (key === 'ev') {
                const standardEvent = FB_STANDARD_EVENTS.filter(f => f.eventName === value);
                if (standardEvent.length > 0) {
                    isStandardEvent = true;
                    eventName = standardEvent[0].eventName;
                    eventDescription = standardEvent[0].eventDescription;
                } else {
                    eventName = value as string;
                }
            }

            if (/cd\[.*\]/.test(key)) {
                const cdLabel = /cd\[(.*)\]/.exec(key);
                dataParams.push({ key, value, cleanKey: cdLabel[1] });
            }
            if (/ud\[.*\]/.test(key)) {
                const description = FB_ADVANCED_MATCHING_PARAMETERS[key];
                if (!advancedMatchingParams.some(s => s.key === key && s.value === value)) {
                    advancedMatchingParams.push({ key, value, description });
                }
            }
        }

        return {
            advancedMatchingParams,
            dataParams,
            eventDescription,
            eventName,
            isStandardEvent,
            pageUrl,
            raw: e.url
        };
    });
};
const getDomainSafely = (message: KeyLoggingEvent) => {
    try {
        if (message.data.post_request_url) {
            return getDomain(message.data.post_request_url);
        } else {
            console.log('message.data missing post_request_url', JSON.stringify(message));
            return '';
        }
    } catch (error) {
        return '';
    }
};
