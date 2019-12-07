const { setup } = require("jest-dev-server");

module.exports = async function globalSetup() {
  await setup({
    debug: true,
    command: `npm run test-server`,
    port: 8125,
    launchTimeout: 50000
  });
};
