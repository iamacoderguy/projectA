const express = require('express');
const router = express.Router();

const render = require('../controllers/render');

router.get('/', (req, res) => {
    render.renderDashboard(req, res);
});

module.exports = router;