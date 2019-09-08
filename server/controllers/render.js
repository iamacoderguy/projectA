const sharedPathHelper = require('../helpers/sharedPathHelper');
const networkHelper = require('../helpers/networkHelper');
const db_Clients = require('../models/db_Clients');
const pinHelper = require('../helpers/pinHelper');

module.exports.renderAPIDashboard = function (req, res) {
    res.render('apiDashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getServerIpAddress(),
        port: networkHelper.getServerPort()
    });
}

module.exports.renderAdminDashboard = function (req, res) {
    res.render('adminDashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getServerIpAddress(),
        port: networkHelper.getServerPort(),
        clients: db_Clients.getClients(),
        pin: pinHelper.getPin()
    });
}