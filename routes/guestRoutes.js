const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const config = require('../config');
const guestController = require('../controllers/guestController');

// const authenticateJWT = (req, res, next) => {
//     const token = req.cookies.token;

//     if (token) {
//         jwt.verify(token, config.jwtSecret, (err, user) => {
//             if (err) {
//                 return res.redirect('/auth/login');
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.redirect('/auth/login');
//     }
// };

// router.get('/', authenticateJWT, orderController.index);
// router.post('/getorder', authenticateJWT, orderController.getorder);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// router.get('/login', (req, res) => {
//     res.render('sign-in', { title: 'Login', error: null });
// });

router.get('/order', guestController.getOrder);
// router.get('/logout', authController.logout);

module.exports = router;
