const debug = require('debug')('servera:routes_files');
const winston = require('winston');

const url = require('url');
const fs = require('fs');
const Promise = require('promise');
const { promisify } = require('util');
const statPromise = promisify(fs.stat);
const readdirPromise = promisify(fs.readdir);

const express = require('express');
const router = express.Router();

const { setSharedPath, getSharedPath } = require('../helpers/sharedPathHelper');

// /api/files
/// GET - returns list of shared files
/// GET ./{filepath / filename / id} - returns the file
/// PUT /path - update shared path

async function validatePath(path, res) {
    try {
        await statPromise(path);
        return Promise.resolve(res);
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            res.status(404).send('not found.');
            return Promise.reject(err);
        }

        winston.error(err);
        res.status(500).send('something failed.');
        return Promise.reject(err);
    }
}

async function readPath(path, res) {
    try {
        const result = await readdirPromise(path);
        return Promise.resolve([result, res]);
    }
    catch (err) {
        winston.error('something failed.', err);
        res.status(500).send('something failed.');
        return Promise.reject(err);
    }
}

router.get('/', async (req, res) => {
    if (req.query.filename) {
        const urlWithoutQuery = url.parse(req.originalUrl).pathname;
        res.redirect(urlWithoutQuery + '/' + req.query.filename);
        return;
    }

    const sharedPath = getSharedPath();
    debug('SharedPath: ' + sharedPath);

    validatePath(sharedPath, res)
    .then(res => readPath(sharedPath, res))
    .then( ([ result, res]) => {
        debug('Result: ' + result);
        res.send(result);
    })
    .catch(_ => {});
});

router.get('/:filename', (req, res) => {
    const sharedFilePath = getSharedPath() + '/' + req.params.filename;
    debug('SharedFilePath: ' + sharedFilePath);

    validatePath(sharedFilePath, res)
    .then(res => res.status(200).sendFile(sharedFilePath))
    .catch(_ => {});
});

router.put('/path', (req, res) => {
    debug('req.body: ', req.body);

    const newPath = req.body.path;

    validatePath(newPath, res)
    .then(res => readPath(newPath, res))
    .then(([result, res]) => {
        setSharedPath(newPath);
        debug('Result: ' + result);
        res.send(result);
    })
    .catch(_ => {});
})

module.exports = router;