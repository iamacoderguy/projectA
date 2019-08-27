const winston = require('winston');
const app = require('./startup/app');

console.info('To enable debug mode, set env DEBUG=servera:*');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;