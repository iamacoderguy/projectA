const debug = require('debug')('servera:routes_files');
const winston = require('winston');

const url = require('url');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const express = require('express');
const router = express.Router();

const { setSharedPath, getSharedPath } = require('../helpers/sharedPathHelper');
const { getAvailableName, tmpDirPath } = require('../helpers/sharedFileHelper');

// /api/files
/// GET - returns list of shared files
/// GET ./{filepath / filename / id} - returns the file
/// PUT /path - update shared path

const statPromise = promisify(fs.stat);
const readdirPromise = promisify(fs.readdir);
const copyFilePromise = promisify(fs.copyFile);
const unlinkPromise = promisify(fs.unlink);

function handleErrorPath(err, res) {
    if (err.code === 'ENOENT') {
        res.status(404).send('not found.');
        return;
    }

    winston.error(err);
    res.status(500).send('something failed.');
}

router.get('/', (req, res) => {
    if (req.query.filename) {
        const urlWithoutQuery = url.parse(req.originalUrl).pathname;
        res.redirect(urlWithoutQuery + '/' + req.query.filename);
        return;
    }

    const sharedDirPath = getSharedPath();
    debug('SharedDirPath: ' + sharedDirPath);

    readdirPromise(sharedDirPath)
        .then(result => {
            debug('Result: ' + result);
            res.send(result);
        })
        .catch(err => {
            handleErrorPath(err, res);
        });
})

router.get('/:filename', (req, res) => {
    const sharedFilePath = path.join(getSharedPath(), req.params.filename);
    debug('SharedFilePath: ' + sharedFilePath);

    statPromise(sharedFilePath)
        .then(_ => res.status(200).sendFile(sharedFilePath))
        .catch(err => handleErrorPath(err, res));
})

router.post('/', (req, res) => {
    const sharedDirPath = getSharedPath();
    debug('SharedDirPath: ' + sharedDirPath);
    debug('req.file: ', req.file);

    readdirPromise(sharedDirPath)
        .then(_ => {
            return getAvailableName(req.file.originalname, sharedDirPath);
        })
        .then(async fname => {
            debug('new fname: ', fname);
            const tmpFile = path.join(tmpDirPath, req.file.filename);
            const fpath = path.join(sharedDirPath, fname);
            await copyFilePromise(tmpFile, fpath, fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE);
            return res.send(fname);
        })
        .catch(err => handleErrorPath(err, res))
        .finally(async () => {
            const tmpFile = path.join(tmpDirPath, req.file.filename);
            debug('unlinking tmp file...', tmpFile);
            await unlinkPromise(tmpFile).catch(err => winston.error(err));
        });
})

router.put('/path', (req, res) => {
    debug('req.body: ', req.body);

    const newPath = req.body.path;

    readdirPromise(newPath)
        .then(result => {
            setSharedPath(newPath);
            debug('Result: ' + result);
            res.send(result);
        })
        .catch(err => handleErrorPath(err, res));
})

module.exports = router;