const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateJWT');
const locationController = require('../controllers/locationController');

router.get('/search', auth.authenticateJWT, locationController.search);
router.post('/getJSONCustomer', auth.authenticateJWT, locationController.getCustomer);
router.post('/saveLocationCustomer', auth.authenticateJWT, locationController.saveLocationCustomer);

module.exports = router;
