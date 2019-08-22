const winston = require('winston');
const express = require('express');
const app = express();

console.info('To enable debug mode, set env DEBUG=servera:*');

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;