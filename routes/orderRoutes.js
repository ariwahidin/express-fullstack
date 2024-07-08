const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const orderController = require('../controllers/orderController');
const baseUrl = config.baseUrl;

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, user) => {
            if (err) {
                return res.redirect(baseUrl + '/auth/login');
            }
            req.user = user;
            next();
        });
    } else {
        res.redirect(baseUrl + '/auth/login');
    }
};

router.get('/', authenticateJWT, orderController.index);
router.post('/getorder', authenticateJWT, orderController.getorder);

module.exports = router;
