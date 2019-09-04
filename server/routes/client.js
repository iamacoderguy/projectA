const express = require('express');
const router = express.Router();

const render = require('../controllers/render');
const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

router.get('/', (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);

    if (client.isAdmin) {
        render.renderAdminDashboard(req, res);
    } else {
        render.renderAPIDashboard(req, res);
    }
});

module.exports = router;