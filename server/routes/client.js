const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');

/**
 * @api {get} / 1. go to dashboard page
 * @apiGroup A.client
 * @apiPermission none
 *
 * @apiDescription It will return API dashboard when client is a normal user
 * 
 * It will return Admin dashboard when client is an Admin
 * @apiSuccess (Success) {Number} status 200
 */
router.get('/', (req, res) => clientController.gotoDashboard(req, res));

module.exports = router;