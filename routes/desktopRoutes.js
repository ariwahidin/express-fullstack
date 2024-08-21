const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateJWT');
const homeController = require('../controllers/desktop/homeController');
const armadaController = require('../controllers/desktop/armadaController');
const attendanceController = require('../controllers/desktop/attendanceController');
// const authController = require('../controllers/api/asics/authController');
// const orderController = require('../controllers/api/asics/orderController');

router.get('/', homeController.index);
router.get('/home', homeController.home);
router.get('/armada', armadaController.index);
router.post('/armada/getStatusArmada', armadaController.getOrdersWithDetail);
router.get('/armada/getOrder', armadaController.getOrdersWithDetail)


// Attendance
router.get('/attendance/index',auth.authenticateJWT, attendanceController.index);
router.get('/attendance/get', auth.authenticateJWT, attendanceController.getAttendance);
router.get('/attendance/get/overtime', auth.authenticateJWT, attendanceController.getOvertime);
router.post('/attendance/overtime/approveOrReject', auth.authenticateJWT, attendanceController.approveOrRejectOvertime);

// router.get('/auth/logout', authController.logout);
// router.post('/order/getorder', auth.authenticateJWT, orderController.getorder);

module.exports = router;