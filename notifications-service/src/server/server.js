'use strict';
const shared = require('dorbel-shared');

const { listen } = shared.utils.serverBootstrap.createApp({
  defaultPort: 3002,
  swaggerDocPath: `${__dirname}/swagger/swagger`,
  controllersPath: `${__dirname}/controllers`
});

module.exports = {
  listen
};
