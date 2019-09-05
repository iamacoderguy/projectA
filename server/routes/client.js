const express = require('express');
const router = express.Router();

const render = require('../controllers/render');
const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

/**
 * @api {get} / 1. go to dashboard page
 * @apiGroup A.client
 * @apiPermission none
 *
 * @apiDescription It will return API dashboard when client is a normal user
 * 
 * It will return Admin dashboard when client is an Admin
 * @apiSuccess (Success) {Number} status 200
 */
router.get('/', (req, res) => {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);

    if (client.isAdmin) {
        render.renderAdminDashboard(req, res);
    } else {
        res.redirect('apidoc/index.html');
    }
});

module.exports = router;