const debug = require('debug')('servera:routes_files');
const winston = require('winston');
const fs = require('fs');

const express = require('express');
const router = express.Router();

const { getSharedPath } = require('../helpers/sharedPathHelper');

// /api/files
/// GET - returns list of shared files
/// GET ./{filepath / filename / id} - returns the file
/// POST - push a file to server

router.get('/', (req, res) => {
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

router.get('/ftp', (req, res) => {
    res.send('Returns the list of shared files in ftp format');
});

module.exports = router;