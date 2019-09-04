const express = require('express');
const router = express.Router();

const render = require('../controllers/render');
const db_Clients = require('../models/db_Clients');

router.get('/', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client = db_Clients.getClient(ipAddr);

    if (client.isAdmin) {
        render.renderAdminDashboard(req, res);
    } else {
        render.renderAPIDashboard(req, res);
    }
});

module.exports = router;