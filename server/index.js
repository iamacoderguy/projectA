const winston = require('winston');
const app = require('./startup/app');
const networkHelper = require('./helpers/networkHelper');

console.info('To enable debug mode, set env DEBUG=servera:*');

const port = networkHelper.getPort();
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;