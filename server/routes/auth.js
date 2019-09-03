const debug = require('debug')('servera:routes_auth');
const express = require('express');
const router = express.Router();

const db_Clients = require('../models/db_Clients');

router.post('/connect', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client = db_Clients.getClient(ipAddr);
    client.createNewSession();

    const jwt = client.generateAuthToken();
    debug(jwt);

    res.status(200).send(jwt);
})

router.post('/disconnect', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client = db_Clients.getClient(ipAddr);
    client.cleanAllSessions();

    res.status(200).send();
})

module.exports = router;