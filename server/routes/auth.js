const debug = require('debug')('servera:routes_auth');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

/**
 * @api {post} /api/auth/connect 1. connect to server
 * @apiGroup B.auth
 * @apiPermission none
 *
 * @apiDescription It will make a connection between the client and the server
 * @apiSuccess (Success) {Number} status 200
 * @apiSuccess (Success) {String} body The token
 * @apiSuccessExample {string} Success-Response:
 *          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2M2Q3MWVlOGU3Zjk2Y2ZlYTk4MTllOWI5ZGNiNWY0IiwiaXNBZG1pbiI6dHJ1ZSwiZXhwQ29kZSI6MTU2NzU5MjA2NDAwMCwiaWF0IjoxNTY3NTkyMDY0LCJleHAiOjE1Njc1OTI5NjR9.bqtY5HAA6CToZk6bVtIoGbZP880MdgtSZmksQ0QevZg
 */
router.post('/connect', (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);
    client.createNewSession();

    const jwt = client.generateAuthToken();
    debug(jwt);

    res.status(200).send(jwt);
})

/**
 * @api {post} /api/auth/disconnect 1. disconnect from server
 * @apiGroup B.auth
 * @apiPermission connected users
 *
 * @apiDescription It will remove the connection between the client and the server
 * @apiSuccess (Success) {Number} status 200
 */
router.post('/disconnect', auth, (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);
    client.cleanAllSessions();

    res.status(200).send();
})

module.exports = router;