const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateJWT');
const dashboardController = require('../controllers/dashboardController');

router.get('/', auth.authenticateJWT, dashboardController.dashboard);

module.exports = router;
