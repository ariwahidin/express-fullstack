const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const locationController = require('../controllers/locationController');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, user) => {
            if (err) {
                return res.redirect('/auth/login');
            }
            req.user = user;
            next();
        });
    } else {
        res.redirect('/auth/login');
    }
};

router.get('/search', authenticateJWT, locationController.search);
router.post('/getJSONCustomer', authenticateJWT, locationController.getCustomer);
router.post('/saveLocationCustomer', authenticateJWT, locationController.saveLocationCustomer);

module.exports = router;
