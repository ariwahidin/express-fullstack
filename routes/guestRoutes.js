const express = require('express');
const router = express.Router();
const {optionalAuthenticateToken} = require('../middleware/authenticateJWT');
const guestController = require('../controllers/guestController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/order',optionalAuthenticateToken, guestController.getOrder);
router.post('/order/status',optionalAuthenticateToken, guestController.getOrderStatus);
router.post('/order/save',optionalAuthenticateToken,  upload.single('imageData'), guestController.saveOrderStatus);
router.post('/getOrder', guestController.getOrderBySPK);
router.post('/order/sendLocation',guestController.sendLocation);

module.exports = router;
