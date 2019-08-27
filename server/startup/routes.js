const express = require('express');
const client = require('../routes/client');
const files = require('../routes/files');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/', client);
    app.use('/api/files', files);
    app.use(error);
}