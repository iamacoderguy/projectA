const express = require('express');
const methodOverride = require('method-override');;
const client = require('../routes/client');
const files = require('../routes/files');
const error = require('../middleware/error');
const multer = require('multer')
const { tmpDirName } = require('../helpers/sharedFileHelper');
const upload = multer({ dest: tmpDirName })
const auth = require('../routes/auth');

module.exports = function (app) {
    app.use(methodOverride('_method')); // override with POST having ?_method=DELETE/PUT/GET
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/', client);
    app.use('/api/files', upload.single('file'), files);
    app.use('/api/auth', auth);
    app.use(error);
}