const express = require('express');
const router = express.Router();
const { getSharedPath } = require('../helpers/sharedPathHelper');

router.get('/', (req, res) => {
    res.render('dashboardView', {
        path: getSharedPath(),
        dashboardName: 'Server-A Dashboard'
    });
});

module.exports = router; 
