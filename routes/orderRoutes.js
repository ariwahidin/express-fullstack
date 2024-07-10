const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateJWT');
const orderController = require('../controllers/orderController');


router.get('/', auth.authenticateJWT, orderController.index);
router.post('/getorder', auth.authenticateJWT, orderController.getorder);

module.exports = router;
