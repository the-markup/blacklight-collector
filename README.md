# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.0.0 (2019-12-18)


### Features

* **codebase:** init ([98925aa](https://gitlab.com/the_markup/blacklight/commit/98925aa0c56c44588caa19fd6e6e10e014c666cb))
* **collector:** - Social links added to output w/ tests- ([8937b9e](https://gitlab.com/the_markup/blacklight/commit/8937b9e1c8a9ad8317c1cd8ce1221b5fdd3d3a90))
* **crawl:** Added functionality to browse  first_party urls ([c1ded10](https://gitlab.com/the_markup/blacklight/commit/c1ded104cfb343be34812d6c2c06641b437722ab))
* **instrument+lint:** Added cookie instrument + tslint ([cadaf53](https://gitlab.com/the_markup/blacklight/commit/cadaf535d76c3861d42964c61e8c1bcd926f6fef))
* **parser:** fingerprintable_api_calls, behavior _event_listen ([53e0c66](https://gitlab.com/the_markup/blacklight/commit/53e0c66924640f36375e7d066641f1471bebbc89))
* **reports+stackrace:** Behaviour_tracking + fp_api report , stack trace ([efbfbf6](https://gitlab.com/the_markup/blacklight/commit/efbfbf69bcd28d3c351e01aee9de2b09f323ec35))
* **technique:** Added canvas fingerprinting + tests ([50d57eb](https://gitlab.com/the_markup/blacklight/commit/50d57eb407b6c8a823b655862be206f778b208ad))
* **types:** Blacklight Events type implementation + example.js ([492d57c](https://gitlab.com/the_markup/blacklight/commit/492d57c01dc7d0971c6236ca23a63ac84ea6f105))
* **types+reports:** Implemented types and added reports to collector ([ead12d0](https://gitlab.com/the_markup/blacklight/commit/ead12d0e2363588ffe13a37f199c75b4832d0ad7))
* **web-beacons:** `setupWebBeaconsInspector`,`web_beacons`-> output ([cb2b34c](https://gitlab.com/the_markup/blacklight/commit/cb2b34c5834fecc0e3d2328be02c30b8351785e8))


### Bug Fixes

* **canvas-fp:** overwrote the args variable by accident ([f51cf19](https://gitlab.com/the_markup/blacklight/commit/f51cf1928166a312add8275dfc882ae4e228549c))


### Install

`npm install`

`npm run build`

### Usage

`node example.js`.

Results are stored in `example-result` by default

`collector` takes the following argumnents:

- `inUrl` **required**
  - The URL you want to scrapes
- `outDir` **required**
- `numPages`
  - default: 3
  - crawl depth
  - The path you want to save the output to
- `headless`
  - Boolean flag, useful for debugging.
- `emulateDevice`
  - Puppeteer makes device emulation pretty easy. Choose from [this list](https://github.com/puppeteer/puppeteer/blob/master/lib/DeviceDescriptors.js)
- `captureHar`
  - default: true
  - Boolean flag to save the HTTP requests to a file in the HAR(Http Archive Format).
  - _TIP:_ Firefox lets you import a HAR file and visualize it using the network tab in the developer tools
  - You can also view it [here](https://toolbox.googleapps.com/apps/har_analyzer/)
- `captureLinks`
  - default: false
  - Save first and third party links from the pages
- `enableAdBlock`
  - default: false
- `clearCache`
  - default: false
  - Clear the browser cookies and cache
- `saveBrowsingProfile`
  - default: false
  - Lets you optionally save the browsing profile to the `outDir`
- `quiet`
  - default: true
  - dont pipe raw event data to stdout
- `title`
