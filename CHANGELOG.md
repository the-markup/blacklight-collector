# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.2](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@1.0.1...@themarkup/blacklight@1.0.2) (2020-04-26)


### Bug Fixes

* **collector:** event_data_all check ([cc24062](https://gitlab.com/the_markup/blacklight/commit/cc2406274fd9b4e6390add44c199cf37c2b7b1c4)), closes [#52](https://gitlab.com/the_markup/blacklight/issues/52)

### [1.0.1](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@1.0.0...@themarkup/blacklight@1.0.1) (2020-04-24)

## [1.0.0](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.8...@themarkup/blacklight@1.0.0) (2020-04-24)


### Bug Fixes

* **cookie-collector:** Cookie instrumentation fix ([268fd3b](https://gitlab.com/the_markup/blacklight/commit/268fd3baf124774b9af2f00f88508e41e42a6ed3))

### [0.0.8](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.7...@themarkup/blacklight@0.0.8) (2020-03-22)

### [0.0.7](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.6...@themarkup/blacklight@0.0.7) (2020-03-22)


### ⚠ BREAKING CHANGES

* **key-logging:** Data exfiltration tests doesnt exist anymore. Need to update reporting software and rename it to key-logging

### Features

* **js-instrument+canvas-fp:** Returning  values from functions in js instrument ([317f116](https://gitlab.com/the_markup/blacklight/commit/317f116c58b3ded8f6c433333a77e85cba4a8d54)), closes [#45](https://gitlab.com/the_markup/blacklight/issues/45)
* **key-logging:** Renamed data_exfiltration test to key_logging ([80d0d0b](https://gitlab.com/the_markup/blacklight/commit/80d0d0bd41f67642e5758dd0ba964cde96a1d2fe)), closes [#44](https://gitlab.com/the_markup/blacklight/issues/44) [#43](https://gitlab.com/the_markup/blacklight/issues/43) [#42](https://gitlab.com/the_markup/blacklight/issues/42)
* **session-recording:** Added session recording detection test ([fcdd60d](https://gitlab.com/the_markup/blacklight/commit/fcdd60da4c7f2dad2e738fd2d0776638a1b767f7)), closes [#50](https://gitlab.com/the_markup/blacklight/issues/50)

### [0.0.6](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.5...@themarkup/blacklight@0.0.6) (2020-02-08)

### [0.0.5](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.4...@themarkup/blacklight@0.0.5) (2020-02-08)


### Bug Fixes

* **browser-profile:** added saveBrowserProfile flag back ([737c78f](https://gitlab.com/the_markup/blacklight/commit/737c78fe91069ddf0410c180a453c29aff787744))

### [0.0.4](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.3...@themarkup/blacklight@0.0.4) (2020-02-08)

### [0.0.3](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.2...@themarkup/blacklight@0.0.3) (2020-02-07)


### Bug Fixes

* **canvas-fp:** added toString to getCanvasText ([bf5f4ed](https://gitlab.com/the_markup/blacklight/commit/bf5f4ed51a2768f95763b69adeaa20baa056399b)), closes [#35](https://gitlab.com/the_markup/blacklight/issues/35) [#39](https://gitlab.com/the_markup/blacklight/issues/39)
* **cookies-report:** error handling for parseCookie and getJsCookies ([368de1c](https://gitlab.com/the_markup/blacklight/commit/368de1c8a77865f68e1e0583f743e011484aea21)), closes [#29](https://gitlab.com/the_markup/blacklight/issues/29) [#30](https://gitlab.com/the_markup/blacklight/issues/30) [#32](https://gitlab.com/the_markup/blacklight/issues/32)
* **fillForms:** wrap page evaluate in try/catch ([1f0071b](https://gitlab.com/the_markup/blacklight/commit/1f0071bf843f291ee82a4a4c781c4b4daac0a3d6)), closes [#34](https://gitlab.com/the_markup/blacklight/issues/34)
* **pptr+data-exfil:** handle pptr launch errors better ([10b3a61](https://gitlab.com/the_markup/blacklight/commit/10b3a613d427ad3f6dab7a4cf149da12ef56c4a5)), closes [#14](https://gitlab.com/the_markup/blacklight/issues/14) [#33](https://gitlab.com/the_markup/blacklight/issues/33) [#36](https://gitlab.com/the_markup/blacklight/issues/36) [#37](https://gitlab.com/the_markup/blacklight/issues/37) [#40](https://gitlab.com/the_markup/blacklight/issues/40)

### [0.0.2](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1...@themarkup/blacklight@0.0.2) (2020-02-01)


### Bug Fixes

* **domain null fix:** cookie parse fix ([3e21786](https://gitlab.com/the_markup/blacklight/commit/3e21786e1068345718c1aa2cc888880353ba0759))

### [0.0.1](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.13...@themarkup/blacklight@0.0.1) (2020-02-01)


### Features

* **1m-prep:** config screenshot + waitUntil , autocomplete-text ([6c272a2](https://gitlab.com/the_markup/blacklight/commit/6c272a285b980bb63341b28e87b0f751af305ca6)), closes [#22](https://gitlab.com/the_markup/blacklight/issues/22) [#25](https://gitlab.com/the_markup/blacklight/issues/25) [#26](https://gitlab.com/the_markup/blacklight/issues/26)
* **autocomplete-input-fields:** added field for html autocomplete input attributes ([179dfe4](https://gitlab.com/the_markup/blacklight/commit/179dfe47d48840655ebd681be36401cf012ea9db))

### [0.0.1-beta.13](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.12...@themarkup/blacklight@0.0.1-beta.13) (2020-01-16)

### [0.0.1-beta.12](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.11...@themarkup/blacklight@0.0.1-beta.12) (2020-01-16)

### [0.0.1-beta.11](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.10...@themarkup/blacklight@0.0.1-beta.11) (2020-01-16)


### Bug Fixes

* Add try catch on getLinks ([e417454](https://gitlab.com/the_markup/blacklight/commit/e417454a7fe654734d9c9818664cea58672e08ef)), closes [#6](https://gitlab.com/the_markup/blacklight/issues/6) [#8](https://gitlab.com/the_markup/blacklight/issues/8) [#15](https://gitlab.com/the_markup/blacklight/issues/15)
* Ignore pdfs and zipfiles in urls ([3f87ec1](https://gitlab.com/the_markup/blacklight/commit/3f87ec16ec5ccdae8a729cf181f4919e958da798)), closes [#1](https://gitlab.com/the_markup/blacklight/issues/1)
* reportEventListeners json parse fix ([8f753da](https://gitlab.com/the_markup/blacklight/commit/8f753da7f0c3237ee2bc88612db11c0859b253e2)), closes [#9](https://gitlab.com/the_markup/blacklight/issues/9)
* Undefined prop fixes ([9dea03b](https://gitlab.com/the_markup/blacklight/commit/9dea03bea810627beef94fbab1467f8ee4dee6aa)), closes [#12](https://gitlab.com/the_markup/blacklight/issues/12) [#13](https://gitlab.com/the_markup/blacklight/issues/13)
* URIError: URI malformed fix ([e99f8d8](https://gitlab.com/the_markup/blacklight/commit/e99f8d83f9dbfd9402b3e1047950219a7c0dcdb5)), closes [#7](https://gitlab.com/the_markup/blacklight/issues/7)
* **canvas-fp:** Fixes to canvas + canvas font fp. ([d65d838](https://gitlab.com/the_markup/blacklight/commit/d65d8387d6b71c9ba82028aefedd3810c1048503)), closes [#20](https://gitlab.com/the_markup/blacklight/issues/20)

### [0.0.1-beta.10](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.9...@themarkup/blacklight@0.0.1-beta.10) (2019-12-18)

### [0.0.1-beta.9](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.8...@themarkup/blacklight@0.0.1-beta.9) (2019-12-18)

### [0.0.1-beta.8](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.7...@themarkup/blacklight@0.0.1-beta.8) (2019-12-18)

### [0.0.1-beta.7](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.7...@themarkup/blacklight@0.0.1-beta.7) (2019-12-18)

### [0.0.1-beta.7](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.6...@themarkup/blacklight@0.0.1-beta.7) (2019-12-18)

### [0.0.1-beta.6](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.5...@themarkup/blacklight@0.0.1-beta.6) (2019-12-18)

### [0.0.1-beta.5](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.4...@themarkup/blacklight@0.0.1-beta.5) (2019-12-18)

### [0.0.1-beta.4](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.3...@themarkup/blacklight@0.0.1-beta.4) (2019-12-18)

### [0.0.1-beta.3](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.2...@themarkup/blacklight@0.0.1-beta.3) (2019-12-18)

### [0.0.1-beta.2](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.1...@themarkup/blacklight@0.0.1-beta.2) (2019-12-18)

### [0.0.1-beta.1](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.1-beta.0...@themarkup/blacklight@0.0.1-beta.1) (2019-12-18)

### [0.0.1-beta.0](https://gitlab.com/the_markup/blacklight/compare/@themarkup/blacklight@0.0.0...@themarkup/blacklight@0.0.1-beta.0) (2019-12-18)

## 0.0.0 (2019-12-18)

### Features

- **codebase:** init ([98925aa](https://gitlab.com/the_markup/blacklight/commit/98925aa0c56c44588caa19fd6e6e10e014c666cb))
- **collector:** - Social links added to output w/ tests- ([8937b9e](https://gitlab.com/the_markup/blacklight/commit/8937b9e1c8a9ad8317c1cd8ce1221b5fdd3d3a90))
- **crawl:** Added functionality to browse first_party urls ([c1ded10](https://gitlab.com/the_markup/blacklight/commit/c1ded104cfb343be34812d6c2c06641b437722ab))
- **instrument+lint:** Added cookie instrument + tslint ([cadaf53](https://gitlab.com/the_markup/blacklight/commit/cadaf535d76c3861d42964c61e8c1bcd926f6fef))
- **parser:** fingerprintable_api_calls, behavior \_event_listen ([53e0c66](https://gitlab.com/the_markup/blacklight/commit/53e0c66924640f36375e7d066641f1471bebbc89))
- **reports+stackrace:** Behaviour_tracking + fp_api report , stack trace ([efbfbf6](https://gitlab.com/the_markup/blacklight/commit/efbfbf69bcd28d3c351e01aee9de2b09f323ec35))
- **technique:** Added canvas fingerprinting + tests ([50d57eb](https://gitlab.com/the_markup/blacklight/commit/50d57eb407b6c8a823b655862be206f778b208ad))
- **types:** Blacklight Events type implementation + example.js ([492d57c](https://gitlab.com/the_markup/blacklight/commit/492d57c01dc7d0971c6236ca23a63ac84ea6f105))
- **types+reports:** Implemented types and added reports to collector ([ead12d0](https://gitlab.com/the_markup/blacklight/commit/ead12d0e2363588ffe13a37f199c75b4832d0ad7))
- **web-beacons:** `setupWebBeaconsInspector`,`web_beacons`-> output ([cb2b34c](https://gitlab.com/the_markup/blacklight/commit/cb2b34c5834fecc0e3d2328be02c30b8351785e8))

### Bug Fixes

- **canvas-fp:** overwrote the args variable by accident ([f51cf19](https://gitlab.com/the_markup/blacklight/commit/f51cf1928166a312add8275dfc882ae4e228549c))
