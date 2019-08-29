const { getSharedPath } = require('../helpers/sharedPathHelper');

module.exports.renderDashboard = function (req, res) {
    res.render('dashboardView', {
        path: getSharedPath(),
        dashboardName: 'Server-A Dashboard'
    });
}