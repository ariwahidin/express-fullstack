const express = require('express');
const router = express.Router();
const {optionalAuthenticateToken} = require('../middleware/authenticateJWT');
const guestController = require('../controllers/guestController');

router.get('/order',optionalAuthenticateToken, guestController.getOrder);
router.post('/order/status',optionalAuthenticateToken, guestController.getOrderStatus);
router.post('/order/save',optionalAuthenticateToken, guestController.saveOrderStatus);
router.post('/getOrder', guestController.getOrderBySPK);

module.exports = router;
