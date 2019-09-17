const render = require('../controllers/render');
const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

module.exports.gotoDashboard = function (req, res) {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getClient(ipAddr);

    if (client.isAdmin) {
        render.renderAdminDashboard(req, res);
    } else {
        res.redirect('apidoc/index.html');
    }
}