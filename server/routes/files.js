const debug = require('debug')('servera:routes_files');
const winston = require('winston');

const url = require('url');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const { setSharedPath, getSharedPath } = require('../helpers/sharedPathHelper');
const { getAvailableName, tmpDirPath } = require('../helpers/sharedFileHelper');

const statPromise = promisify(fs.stat);
const readdirPromise = promisify(fs.readdir);
const renamePromise = promisify(fs.rename);
const unlinkPromise = promisify(fs.unlink);

function handleErrorPath(err, res) {
    if (err.code === 'ENOENT') {
        res.status(404).send('not found.');
        return;
    }

    winston.error(err);
    res.status(500).send('something failed.');
}

/**
 * @api {get} /api/files 1. get the shared files list
 * @apiGroup C.files
 * @apiPermission connected users
 * @apiHeader {String} x-auth-token The token got from /api/auth/connect
 *
 * @apiDescription It will return the list of files in the shared folder
 * @apiSuccess (Success) {Number} status 200
 * @apiSuccess (Success) {String[]} body List of shared files
 * @apiSuccessExample {json} Success-Response:
 *          [
 *              "file 1.ext",
 *              "file 2.ext"
 *          ]
 */
router.get('/', auth, (req, res) => {
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

/**
 * @api {get} /api/files/:filename 2. get a shared file
 * @apiGroup C.files
 * @apiPermission connected users
 * @apiHeader {String} x-auth-token The token got from /api/auth/connect
 *
 * @apiDescription It will return a shared file in the shared folder
 * @apiParam {String} filename The shared file's name
 * @apiSuccess (Success) {Number} status 200
 * @apiSuccess (Success) {file} body The shared file
 */
router.get('/:filename', auth, (req, res) => {
    const sharedFilePath = path.join(getSharedPath(), req.params.filename);
    debug('SharedFilePath: ' + sharedFilePath);

    statPromise(sharedFilePath)
        .then(_ => res.status(200).sendFile(sharedFilePath))
        .catch(err => handleErrorPath(err, res));
})

/**
 * @api {post} /api/files 3. upload a file
 * @apiGroup C.files
 * @apiPermission connected users
 * @apiHeader {String} x-auth-token The token got from /api/auth/connect
 *
 * @apiDescription It will upload a file to the shared folder
 * @apiParam {String} file The file via multipart/form-data
 * @apiSuccess (Success) {Number} status 200
 * @apiSuccess (Success) {String} body The filename on server
 * @apiSuccessExample {string} Success-Response:
 *      filename_1.ext
 */
router.post('/', auth, (req, res) => {
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
            await renamePromise(tmpFile, fpath);
            return res.send(fname);
        })
        .catch(async err => {
            const tmpFile = path.join(tmpDirPath, req.file.filename);
            debug('unlinking tmp file...', tmpFile);
            await unlinkPromise(tmpFile).catch(err => winston.error(err));
            handleErrorPath(err, res);
        });
})

/**
 * @api {put} /api/files/path 4. change the shared folder
 * @apiGroup C.files
 * @apiPermission admin
 *
 * @apiDescription It will change the shared folder's path
 * @apiParam {String} path The shared path
 * @apiParamExample {json} Request-Example:
 *          {
 *              "path": "C:\\Users\\username\\Downloads"
 *          }
 * @apiSuccess (Success) {Number} status 200
 * @apiSuccess (Success) {String[]} body List of shared files
 * @apiSuccessExample {json} Success-Response:
 *          [
 *              "file 1.ext",
 *              "file 2.ext"
 *          ]
 */
router.put('/path', admin, (req, res) => {
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