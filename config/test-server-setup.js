const { setup: setupDevServer } = require("jest-dev-server");

module.exports = async function globalSetup() {
  globalThis.servers = await setupDevServer({
    debug: true,
    command: `npm run test-server`,
    port: 8125,
    launchTimeout: 50000
  });
};
