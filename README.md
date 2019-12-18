
### Install

`npm install`

`npm run build`

### Usage

`node example.js`.

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
- `saveBrowsingProfile`
  - default: false
  - Lets you optionally save the browsing profile to the `outDir`
- `quiet`
  - default: true
  - dont pipe raw event data to stdout
- `title`
