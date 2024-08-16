const express = require('express');
const router = express.Router();
const { optionalAuthenticateToken } = require('../middleware/authenticateJWT');
const attendanceController = require('../controllers/attendanceController');
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

router.get('/order', optionalAuthenticateToken, attendanceController.getAttendance);
router.post('/order/status', optionalAuthenticateToken, attendanceController.getOrderStatus);
router.post('/order/save', optionalAuthenticateToken, upload.single('imageData'), attendanceController.saveOrderStatus);
router.post('/getOrder', attendanceController.getOrderBySPK);
router.post('/order/sendLocation', attendanceController.sendLocation);
router.get('/get', attendanceController.getAttendance);
router.post('/submit-attendance', attendanceController.submitAttendance);
router.get('/attendance-cards', attendanceController.getAttendanceCards);

router.get('/testSocket', (req, res) => {
    req.io.emit('updateArmadas');
    res.json({ success: true })
});

module.exports = router;
