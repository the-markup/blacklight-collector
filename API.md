# API 

## collector(options)
Runs the inspection
- options

  - `inUrl`<string> The URL you want to inspect
  - `outDir`<string>  By default saves inspection the detailed report to tmp directory and deletes after completion. To save the full report provide a directory path.
  - `numPages`<number> Defaults to 2. Number of additional pages to inspect
  - `headless`<boolean>  Default is false, useful for debugging.
  - `emulateDevice`<string> Puppeteer makes device emulation pretty easy. Choose from [this list](https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js)
  - `captureHar`<boolean> Default is true Flag to save the HTTP requests to a file in the HAR(Http Archive Format).
    - Note: You will need to provide a path to `outDir` if you want to see the captured file
    - *_**TIP:**_* Firefox lets you import a HAR file and visualize it using the network tab in the developer tools
    -  You can also view it [here](https://toolbox.googleapps.com/apps/har_analyzer/)
  - `captureLinks`<boolean> Default is false. Save first and third party links from the pages
  - `enableAdBlock`<boolean> Default is false
  - `clearCache`<boolean> Default is false. Clear the browser cookies and cache
  - `saveBrowsingProfile` <boolean> Default is false. Lets you optionally save the browsing profile to the `outDir`
  - quiet`<boolean>Default is false`
  - title`<string> Default is 'Blacklight Inspection'`
  - saveScreenshots`<boolean> Default is true`
  - defaultTimeout`<number> Default is 30000. Amount of time in ms the page will wait to load`
  - defaultWaitUntil`<string> Default is 'networkidle2'. [Other options](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagegotourl-options)

- returns: <BlacklightReport>

  - `title` <string> Name of the inspection. Defaults to  `Blacklight Inspection`.

  - `uri_ins`<string> URL to inspect.

  - `uri_dest`<string> URL inspected after any redirects.

  - `uri_redirects`<Array<string>> Redirect route.

  - `secure_connection`<Object> Not implmeneted.

  - `host`<srring> URL hostname

  - `config`<Object> Collection configuration

    - `clearCache`<boolean> If true, clears the browser cache at the start of the inspection.
    - `captureHar`<boolean> If true, saves the network requests to a HAR file.
    - `captureLinks`<boolean> If true, adds the links on a page to the inspection report.
    - `emulateDevice`<string> Device string. From puppeteer [device descriptors list](https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js).
    - `numPages`<number> Number of additional pages to inspect.

  - `browser`<Object>  Browser configuration.

    - `name`: Name of the browser used. Default is Chromium.
    - `version` <string> Browser build number.
    - `user_agent`<string>
    - `platform`<Object> 
      - `name`<string> Name of the OS running the inspection.
      - `version`<string>

  - `script` Information about the current script

    - `host`<string> name of the host running the script

    - `version`<Object> 

      - `npm` <string> package.json version
      - `commit`<?string>

    - `node_version`<string>

    - `start_time`<string> Inspection start time

    - `end_time`<string> Inspection end

    - `deviceEmulated`<Object>

      - `name`<string>
      - `userAgent`<string>
      - `viewport`<Object>

    - `browsing_history`<Array<String>> Pages visited in inspection

    - `hosts`<Object> Hostnames of the URLs the page interacted with during the inspection

      - `requests`
        - `first_party`<Array<string>>
        - `third_party`<Array<string>>

    - `reports`<Object> Black Light test reports.

      - `cookies`<Array<Object>> Object properties -

        - `name` Cookie name
        - `value`<string> Cookie value
        - `domain` <string> Domain cookie is set for
        - `path`<string>
        - `expires` <number>
        - `size` <number>
        - `httpOnly`<boolean>
        - `secure` <boolean>
        - `session`<boolean>
        - `expiresUTC`<string> 
        - `expiresDays`<number> Number of days till it expires
        - `type` <string> Js|HTTP|unknown
        - `third_party`<boolean>

      - `behaviour_event_listeners`<Object>  Scripts that are monitoring 

        - KEYBOARD<Object>
          - Key<string> Name of scripts
          - Value: <Array<string>> List of keyboard events the script is monitoring
        - MOUSE
          - Key<string> Name of scripts
          - Value: <Array<string>> List of mouse events the script is monitoring
        - TOUCH
          - Key<string> Name of scripts
          - Value: <Array<string>> List of touch events the script is monitoring
        - SENSOR
          - Key<string> Name of scripts
          - Value: <Array<string>> List of mouse events the script is monitoring

      - `data_exfiltration` <Object>
        - Key<string> Name of script carrying out keylogging
        - Value<Array<Object>>
          - `base_64` <boolean> True if the value if base64 encoded
          - `filter`<Array<string>> String that Black Light types into input field that was detected in the post request body
          - `post_data`<string> Stringified JSON post body of the network request where the text string match was found
          - `post_request_url`<string>
          - `post_request_ps`<string>

      - `canvas_fingerprinters` 

        - `fingerprinters`<Array<string>> List of scripts that are carrying out canvas fingerprinting based on Princeton study methodlogy.
        - `styles`<Object> Styles that were set in the canvas by the fingerprinting scripts
        - `texts`<Object> Texts that were written to the canvas  by the fingerprinting scrips

      - `canvas_font_fingerprinting` Record of scripts that are carrying out font fingerprinting

        - `canvas_font`<Object>
        - `text_meanse`<Object>

      - `fingerprintable_api_calls`<Object> 

        - NAVIGATOR<Object>
          - Key<string> Name of scripts
          - Value: <Array<string>> List of navigator window properties the script called

        - SCREEN<Object>
          - Key<string> Name of scripts
          - Value: <Array<string>> List of navigator window properties the script called
        - MEDIA_DEVICES<Object>
          - Key<string> Name of scripts
          - Value: <Array<string>> List of navigator window properties the script called
        - CANVAS<Object>
          - Key<string> Name of scripts
          - Value: <Array<string>> List of navigator window properties the script

      - `web_beacons` <Array<Objects>>

        - `data`<Object>
        - `stack`<Array<Objects>>
        - `type`<string>
        - `url`<string>