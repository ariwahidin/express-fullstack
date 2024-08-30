const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateJWT');
const homeController = require('../controllers/desktop/homeController');
const armadaController = require('../controllers/desktop/armadaController');
const attendanceController = require('../controllers/desktop/attendanceController');
const userController = require('../controllers/desktop/userController');
// const orderController = require('../controllers/api/asics/orderController');

router.get('/', auth.authenticateJWT, homeController.index);
router.get('/home', auth.authenticateJWT, homeController.home);
router.get('/armada', auth.authenticateJWT, armadaController.index);
router.post('/armada/getStatusArmada', armadaController.getOrdersWithDetail);
router.get('/armada/getOrder', armadaController.getOrdersWithDetail)


// Attendance
router.get('/attendance/index', auth.authenticateJWT, attendanceController.index);
router.get('/attendance/get', auth.authenticateJWT, attendanceController.getAttendance);
router.get('/attendance/employee/schedule', auth.authenticateJWT, attendanceController.employeeSchedule);
router.get('/attendance/get/overtime', auth.authenticateJWT, attendanceController.getOvertime);
router.post('/attendance/overtime/approveOrReject', auth.authenticateJWT, attendanceController.approveOrRejectOvertime);
router.post('/attendance/employee/shift', auth.authenticateJWT, attendanceController.saveEmployeeShift);
router.post('/attendance/sift/month', auth.authenticateJWT, attendanceController.getEmployeeSifts);
router.post('/attendance/employee/table', auth.authenticateJWT, attendanceController.employeTable);



// User
router.get('/user/index', auth.authenticateJWT, userController.index);
router.post('/user/add', auth.authenticateJWT, userController.create);
router.get('/user/table', auth.authenticateJWT, userController.getUserTable);
router.post('/user/delete', auth.authenticateJWT, userController.deleteUser);
router.post('/user/update', auth.authenticateJWT, userController.updateUser);


// router.get('/auth/logout', authController.logout);
// router.post('/order/getorder', auth.authenticateJWT, orderController.getorder);

module.exports = router;