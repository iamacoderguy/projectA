const debug = require('debug')('servera:routes_files');
const winston = require('winston');
const fs = require('fs');
const url = require('url');

const express = require('express');
const router = express.Router();

const { setSharedPath, getSharedPath } = require('../helpers/sharedPathHelper');

// /api/files
/// GET - returns list of shared files
/// GET ./{filepath / filename / id} - returns the file
/// PUT /path - update shared path

router.get('/', (req, res) => {
    if (req.query.filename) {
        const urlWithoutQuery = url.parse(req.originalUrl).pathname;
        res.redirect(urlWithoutQuery + '/' + req.query.filename);
        return;
    }

    let sharedPath = getSharedPath();
    debug('SharedPath: ' + sharedPath);

    fs.stat(sharedPath, (err, stats) => {
        if (!err) {
            fs.readdir(sharedPath, (err, result) => {
                if (!err) {
                    debug('Result: ' + result);
                    res.send(result);
                } else {
                    winston.error('something failed.', err);
                }
            });
            return;
        }

        if (err.code === 'ENOENT') {
            res.status(404).send('not found.');
            return;
        }

        winston.error(err);
        res.status(500).send('something failed.');
    })
});

router.get('/:filename', (req, res) => {
    let sharedFilePath = getSharedPath() + '/' + req.params.filename;
    debug('SharedFilePath: ' + sharedFilePath);

    fs.stat(sharedFilePath, (err, stats) => {
        if (!err) {
            // send file to client
            res.status(200).sendFile(sharedFilePath);
            return;
        }

        if (err.code === 'ENOENT') {
            res.status(404).send('not found.');
            return;
        }

        winston.error(err);
        res.status(500).send('something failed.');
    })
});

router.put('/path', (req, res) => {
    debug('req.body: ', req.body);

    let newPath = req.body.path;

    fs.stat(newPath, (err, stats) => {
        if (!err) {
            fs.readdir(newPath, (err, result) => {
                if (!err) {
                    setSharedPath(newPath);

                    debug('Result: ' + result);
                    res.send(result);
                } else {
                    winston.error('something failed.', err);
                }
            });
            return;
        }

        if (err.code === 'ENOENT') {
            res.status(404).send('not found.');
            return;
        }

        winston.error(err);
        res.status(500).send('something failed.');
    })
})

module.exports = router;