const debug = require('debug')('servera:routes_auth');
const express = require('express');
const router = express.Router();

const db_Clients = require('../models/db_Clients');
const db_ExpCodes = require('../models/db_ExpCodes');
const authHelper = require('../helpers/authHelper');

router.post('/connect', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client = db_Clients.getClient(ipAddr);
    const expCode = db_ExpCodes.setExpCode(client);

    const jwt = authHelper.generateAuthToken(client, expCode);
    debug(jwt);

    res.status(200).send(jwt);
})

router.post('/disconnect', (req, res) => {
    res.status(501).send();
})

module.exports = router;