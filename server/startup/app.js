// seperating app and server is a tip to resolve EADDRINUSE error during testing
// ref: http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

const express = require('express');
const app = express();

require('./logging')(app);
require('./routes')(app);
require('./static')(app);
require('./config')();
require('./prod')(app);

module.exports = app;