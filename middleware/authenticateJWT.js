const jwt = require('jsonwebtoken');
const config = require('../config'); // pastikan Anda memiliki file config untuk jwtSecret
const { use } = require('../routes/authRoutes');

const baseUrl = config.baseUrl;

const authenticateJWT = (req, res, next) => {

  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, user) => {

      console.log(user);

      if (err && err.name === 'TokenExpiredError') {
        if (refreshToken) {
          jwt.verify(refreshToken, config.jwtRefreshSecret, (err, user) => {
            if (err) {
              // Redirect to login if refresh token is invalid
              return res.redirect(baseUrl + '/auth/login');
            }

            // Generate new access token
            const newAccessToken = jwt.sign(
              {
                id: user.id, 
                username: user.username,
                placement_id: user.placement_id, 
                lat: user.lat, 
                lon: user.lon,
                placement_name: user.placement_name
              }, config.jwtSecret, { expiresIn: '300s' });
            res.cookie('token', newAccessToken, { httpOnly: true });

            req.user = user;
            return next();
          });
        } else {
          return res.redirect(baseUrl + '/auth/login');
        }
      } else if (err) {
        return res.redirect(baseUrl + '/auth/login');
      } else {
        req.user = user;
        next();
      }
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

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateJWT, optionalAuthenticateToken };
