const sharedPathHelper = require('../helpers/sharedPathHelper');
const networkHelper = require('../helpers/networkHelper');
const db_Clients = require('../models/db_Clients');

module.exports.renderAPIDashboard = function (req, res) {
    res.render('apiDashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getIpAddress(),
        port: networkHelper.getPort()
    });
}

module.exports.renderAdminDashboard = function (req, res) {
    res.render('adminDashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getIpAddress(),
        port: networkHelper.getPort(),
        clients: db_Clients.getClients()
    });
}