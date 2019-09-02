const sharedPathHelper = require('../helpers/sharedPathHelper');
const networkHelper = require('../helpers/networkHelper');

module.exports.renderDashboard = function (req, res) {
    res.render('dashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard',
        ipAddress: networkHelper.getIpAddress(),
        port: networkHelper.getPort()
    });
}