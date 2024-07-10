const jwt = require('jsonwebtoken');
const config = require('../config'); // pastikan Anda memiliki file config untuk jwtSecret
const { use } = require('../routes/authRoutes');

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


const optionalAuthenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      req.user = null;
      return next();
  }

  jwt.verify(token,  config.jwtSecret, (err, user) => {
      if (err) {
          req.user = null;
          return next();
      }

      req.user = user;
      next();
  });
};

module.exports = {authenticateJWT, optionalAuthenticateToken};
