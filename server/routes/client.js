const express = require('express');
const router = express.Router();

const render = require('../controllers/render');
const networkHelper = require('../helpers/networkHelper');

router.get('/', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (networkHelper.isFromLocalhost(ipAddr)) {
        render.renderAdminDashboard(req, res);
    } else {
        render.renderAPIDashboard(req, res);
    }
});

module.exports = router;