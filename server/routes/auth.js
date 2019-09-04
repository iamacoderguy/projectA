const debug = require('debug')('servera:routes_auth');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

router.post('/connect', (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);
    client.createNewSession();

    const jwt = client.generateAuthToken();
    debug(jwt);

    res.status(200).send(jwt);
})

router.post('/disconnect', auth, (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);
    client.cleanAllSessions();

    res.status(200).send();
})

module.exports = router;