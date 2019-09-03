const sharedPathHelper = require('../helpers/sharedPathHelper');
const networkHelper = require('../helpers/networkHelper');
const clientHelper = require('../helpers/clientHelper');

module.exports.renderAPIDashboard = function (req, res) {
    res.render('apiDashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getIpAddress(),
        port: networkHelper.getPort()
    });
}

module.exports.renderDashboard = function (req, res) {
    res.render('dashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getIpAddress(),
        port: networkHelper.getPort(),
        clients: clientHelper.getClients()
    });
}