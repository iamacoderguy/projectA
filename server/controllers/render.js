const sharedPathHelper = require('../helpers/sharedPathHelper');

module.exports.renderDashboard = function (req, res) {
    res.render('dashboardView', {
        path: sharedPathHelper.getSharedPath(),
        dashboardName: 'Server-A Dashboard'
    });
}