const debug = require('debug')('servera:routes_files');
const winston = require('winston');

const url = require('url');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const express = require('express');
const router = express.Router();

const { setSharedPath, getSharedPath } = require('../helpers/sharedPathHelper');

// /api/files
/// GET - returns list of shared files
/// GET ./{filepath / filename / id} - returns the file
/// PUT /path - update shared path

const statPromise = promisify(fs.stat);
const readdirPromise = promisify(fs.readdir);
const copyFilePromise = promisify(fs.copyFile);

function handleErrorPath(err, res) {
    if (err.code === 'ENOENT') {
        res.status(404).send('not found.');
        return;
    }

    winston.error(err);
    res.status(500).send('something failed.');
}

async function isAvailable(fname, dpath) {
    const fpath = path.join(dpath, fname);

    try {
        await statPromise(fpath);
        return Promise.reject( {code: 'Existed'} );
    }
    catch (err) {
        console.log('isAvailable: ', err);
        if (err.code === 'ENOENT') {
            return Promise.resolve(fname);
        }
        return Promise.reject(err);
    }
}

function getAvailableName(fname, dpath) {
    const ename = path.extname(fname);
    const bname = path.basename(fname, ename);
    return bname + '_1' + ename;
}

router.get('/', async (req, res) => {
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

    readdirPromise(sharedDirPath)
        .then(_ => {
            debug('req.file: ', req.file);
            return isAvailable(req.file.originalname, sharedDirPath);
        })
        .catch(err => {
            if (err.code === 'Existed') {
                const newName = getAvailableName(req.file.originalname, sharedDirPath);
                return Promise.resolve(newName);
            } else {
                return Promise.reject(err);
            }
        })
        .then(async fname => {
            const tmpFile = path.join(__dirname, '../_tmp', req.file.filename);
            const fpath = path.join(sharedDirPath, fname);
            await copyFilePromise(tmpFile, fpath, fs.constants.COPYFILE_FICLONE);
            return res.send(fname);
        })
        .catch(err => handleErrorPath(err, res));
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