const db_Clients = require('../models/db_Clients');
const networkHelper = require('../helpers/networkHelper');

module.exports = function (req, res, next) {
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const client = db_Clients.getOrNewClientIfNotExisted(ipAddr);

    if (!client.isAdmin) return res.status(403).send('Access denied.');
    else next();
}