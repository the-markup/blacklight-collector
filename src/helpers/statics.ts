export const BEHAVIOUR_TRACKING_EVENTS = {
    KEYBOARD: ['keydown', 'keypress', 'keyup', 'input'],
    MOUSE: ['click', 'mousedown', 'mouseup', 'mousemove', 'select', 'dblclick', 'scroll'],
    SENSOR: ['devicemotion', 'deviceorientation', 'orientationchange'],
    TOUCH: ['touchmove', 'touchstart', 'touchend', 'touchcancel']
};

export const FINGERPRINTABLE_WINDOW_APIS = {
    AUDIO: [
        'AudioContext.createOscillator',
        'AudioContext.createAnalyser',
        'AudioContext.createBiquadFilter',
        'AudioContext.createBuffer',
        'AudioContext.createGain',
        'AudioContext.createScriptProcessor',
        'AudioContext.destination',
        'AnalyserNode.connect',
        'AnalyserNode.disconnect',
        'AnalyserNode.frequencyBinCount',
        'AnalyserNode.getFloatFrequencyData',
        'GainNode.connect',
        'GainNode.gain',
        'GainNode.disconnect',
        'OscillatorNode.type',
        'OscillatorNode.connect',
        'OscillatorNode.stop',
        'OscillatorNode.start',
        'ScriptProcessorNode.connect',
        'ScriptProcessorNode.onaudioprocess',
        'ScriptProcessorNode.disconnect'
    ],
    BATTERY: ['window.BatteryManager', 'window.navigator.getBattery'],
    CANVAS: [
        'CanvasRenderingContext2D.getImageData',
        'CanvasRenderingContext2D.fillText',
        'CanvasRenderingContext2D.strokeText',
        'CanvasRenderingContext2D.save',
        'HTMLCanvasElement.toDataURL',
        'HTMLCanvasElement.addEventListener'
    ],
    MEDIA_DEVICES: ['window.navigator.mediaDevices.enumerateDevices'],
    MIME: ['window.navigator.mimeTypes'],
    NAVIGATOR: [
        'window.navigator.appCodeName',
        'window.navigator.appName',
        'window.navigator.appVersion',
        'window.navigator.clipboard',
        'window.navigator.cookieEnabled',
        'window.navigator.doNotTrack',
        'window.navigator.geolocation',
        'window.navigator.language',
        'window.navigator.languages',
        'window.navigator.onLine',
        'window.navigator.platform',
        'window.navigator.product',
        'window.navigator.productSub',
        'window.navigator.userAgent',
        'window.navigator.vendorSub',
        'window.navigator.vendor'
    ],
    PLUGIN: ['window.navigator.plugins'],
    SCREEN: ['window.screen.pixelDepth', 'window.screen.colorDepth'],
    WEBRTC: ['RTCPeerConnection']
};

export const SESSION_RECORDERS_LIST = [
    'mc.yandex.ru/metrika/watch.js',
    'mc.yandex.ru/metrika/tag.js',
    'mc.yandex.ru/webvisor/',
    'fullstory.com/s/fs.js',
    'd2oh4tlt9mrke9.cloudfront.net/Record/js/sessioncam.recorder.js',
    'ws.sessioncam.com/Record/record.asmx',
    'userreplay.net',
    'static.hotjar.com',
    'script.hotjar.com',
    'insights.hotjar.com/api',
    'clicktale.net',
    'smartlook.com',
    'decibelinsight.net',
    'quantummetric.com',
    'inspectlet.com',
    'mouseflow.com',
    'logrocket.com',
    'salemove.com',
    'd10lpsik1i8c69.cloudfront.net',
    'luckyorange.com',
    'vwo.com'
];

// Facebook Statics

// https://web.archive.org/web/20200413102542/https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
export const FB_ADVANCED_MATCHING_PARAMETERS = {
    'ud[em]': 'Email',
    'ud[fn]': 'First Name',
    'ud[ln]': 'Last Name',
    'ud[ph]': 'Phone',
    'ud[ge]': 'Gender',
    'ud[db]': 'Birthdate',
    'ud[city]': 'City',
    'ud[ct]': 'City',
    'ud[state]': 'State or Province',
    'ud[st]': 'State or Province',
    'ud[zp]': 'Zip Code',
    'ud[cn]': 'Country',
    'ud[country]': 'Country',
    'ud[external_id]': 'An ID from another database.'
};

// https://web.archive.org/web/20200519201636/https://developers.facebook.com/docs/facebook-pixel/reference
export const FB_STANDARD_EVENTS = [
    {
        eventDescription: `When payment information is added in the checkout flow. For example - A person clicks on a save billing information button`,
        eventName: 'AddPaymentInfo'
    },
    {
        eventDescription: `When a product is added to the shopping cart. For example - A person clicks on an add to cart button.`,
        eventName: 'AddToCart'
    },
    {
        eventDescription: 'When a product is added to a wishlist. For example - A person clicks on an add to wishlist button. ',
        eventName: 'AddToWishlist'
    },
    {
        eventDescription: 'When a registration form is completed. For example - A person submits a completed subscription or signup form.',
        eventName: 'CompleteRegistration'
    },
    {
        eventDescription:
            'When a person initiates contact with your business via telephone, SMS, email, chat, etc. For example - A person submits a question about a product',
        eventName: 'Contact'
    },
    {
        eventDescription: 'When a person customizes a product. For example - A person selects the color of a t-shirt.',
        eventName: 'CustomizeProduct'
    },
    {
        eventDescription:
            'When a person donates funds to your organization or cause. For example - A person adds a donation to the Humane Society to their cart',
        eventName: 'Donate'
    },
    {
        eventDescription:
            'When a person searches for a location of your store via a website or app, with an intention to visit the physical location. For example - A person wants to find a specific product in a local store. ',
        eventName: 'FindLocation'
    },
    {
        eventDescription:
            'When a person enters the checkout flow prior to completing the checkout flow. For example - A person clicks on a checkout button.',
        eventName: 'InitiateCheckout'
    },
    {
        eventDescription: 'When a sign up is completed. For example - A person clicks on pricing.',
        eventName: 'Lead'
    },
    {
        eventDescription: 'This is the default pixel tracking page visits. For example - A person lands on your website pages.',
        eventName: 'PageView'
    },
    {
        eventDescription:
            'When a purchase is made or checkout flow is completed. A person has finished the purchase or checkout flow and lands on thank you or confirmation page',
        eventName: 'Purchase'
    },
    {
        eventDescription:
            'When a person books an appointment to visit one of your locations. A person selects a date and time for a dentist appointment.',
        eventName: 'Schedule'
    },
    {
        eventDescription: 'When a search is made. A person searches for a product on your website.',
        eventName: 'Search'
    },
    {
        eventDescription: 'When a person starts a free trial of a product or service you offer. A person selects a free week of your game',
        eventName: 'StartTrial'
    },
    {
        eventDescription:
            'When a person applies for a product, service, or program you offer. For example - A person applies for a credit card, educational program, or job. ',
        eventName: 'SubmitApplication'
    },
    {
        eventDescription: 'When a person applies to a start a paid subscription for a product or service you offer.',
        eventName: 'Subscribe'
    },
    {
        eventDescription:
            "A visit to a web page you care about (for example, a product page or landing page). ViewContent tells you if someone visits a web page's URL, but not what they see or do on that page. For example - A person lands on a product details page",
        eventName: 'ViewContent'
    }
];

export const SOCIAL_URLS = [
    'facebook\\.com',
    'linkedin\\.com',
    'twitter\\.com',
    'youtube\\.com',
    'instagram\\.com',
    'flickr\\.com',
    'tumblr\\.com',
    'snapchat\\.com',
    'whatsapp\\.com',
    'docs\\.google\\.com',
    'goo\\.gl',
    'pinterest\\.com',
    'bit\\.ly',
    'evernote\\.com',
    'eventbrite\\.com',
    'dropbox\\.com',
    'slideshare\\.net',
    'vimeo\\.com',
    'x\\.com',
    'bsky\\.app',
    'tiktok\\.com',
    'mastodon\\.social',
    'threads\\.net',
    'wechat\\.com',
    'messenger\\.com',
    'telegram\\.org',
    'douyin\\.com',
    'kuaishou\\.com',
    'weibo\\.com',
    'im\\.qq\\.com',
];
