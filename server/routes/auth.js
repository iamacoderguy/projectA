const debug = require('debug')('servera:routes_auth');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

const pinHelper = require('../helpers/pinHelper');

/**
 * @api {post} /api/auth/connect 1. connect to server
 * @apiGroup B.auth
 * @apiPermission none (for making new connect) || connected users (for refreshing the connection)
 * @apiHeader {String} x-auth-token Connection PIN when making a new connection || The token got from /api/auth/connect when refreshing the connection.
 *
 * @apiDescription It will (make a new / refresh current) connection between the client and the server.
 * A connection will be expired in 15 minutes. You have to make a new connection when your connection expired.
 * @apiSuccess (Success) {Number} status 200
 * @apiSuccess (Success) {String} body The token
 * @apiSuccessExample {string} Success-Response:
 *          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2M2Q3MWVlOGU3Zjk2Y2ZlYTk4MTllOWI5ZGNiNWY0IiwiaXNBZG1pbiI6dHJ1ZSwiZXhwQ29kZSI6MTU2NzU5MjA2NDAwMCwiaWF0IjoxNTY3NTkyMDY0LCJleHAiOjE1Njc1OTI5NjR9.bqtY5HAA6CToZk6bVtIoGbZP880MdgtSZmksQ0QevZg
 */

router.post('/connect', (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getOrNewClientIfNotExisted(ipAddr);
    const status = client.getStatus();

    if (status === 'disconnected' || status === 'expired') {
        makeNewConnection(req, res, client);
    } else {
        refreshConnection(req, res, client);
    }
})

function createNewSession(res, client) {
    client.createNewSession();
    const jwt = client.generateAuthToken();
    debug(jwt);
    res.status(200).send(jwt);
}

function refreshConnection(req, res, client) {
    auth(req, res, () => createNewSession(res, client));
}

function makeNewConnection(req, res, client) {
    const pin = req.header('x-auth-token');
    if (pin && pin.toString() == pinHelper.getPin().toString()) {
        createNewSession(res, client);
    } else {
        res.status(400).send('wrong pin');
    }
}

/**
 * @api {post} /api/auth/disconnect 2. disconnect from server
 * @apiGroup B.auth
 * @apiPermission connected users
 * @apiHeader {String} x-auth-token The token got from /api/auth/connect
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

/**
 * @api {put} /api/auth/pin 3. set a new connection pin
 * @apiGroup B.auth
 * @apiPermission admin
 * 
 * @apiDescription It will change the connection pin of server and disconnect all connected clients.
 * All tokens generated by the old pin will be invalid.
 * @apiParam {String} pin The connection pin
 * @apiParamExample {json} Request-Example:
 *          {
 *              "pin": "123456"
 *          }
 * @apiSuccess (Success) {Number} status 200
 */

router.put('/pin', admin, (req, res) => {
    debug('req.body: ', req.body);

    const newPin = Number(req.body.pin);
    if (Object.is(newPin, NaN)) {
        res.status(400).send('pin is missed or is not a number');
        return;
    }

    pinHelper.setPin(newPin);

    disconnectAllClients();

    res.status(200).send();
})

function disconnectAllClients() {
    const clients = db_Clients.getClients();
    clients.forEach(client => {
        client.cleanAllSessions();
    });
}

module.exports = router;