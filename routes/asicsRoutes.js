const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateJWT');
const authController = require('../controllers/api/asics/authController');
const orderController = require('../controllers/api/asics/orderController');

router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);
router.post('/order/getorder', auth.authenticateJWT, orderController.getorder);

module.exports = router;