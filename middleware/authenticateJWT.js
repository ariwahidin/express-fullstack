const jwt = require('jsonwebtoken');
const config = require('../config'); // pastikan Anda memiliki file config untuk jwtSecret
const { use } = require('../routes/authRoutes');
const useragent = require('useragent'); // Import useragent
const logger = require('../utils/logger'); // Import logger

const baseUrl = config.baseUrl;

const authenticateJWT = (req, res, next) => {

  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const agent = useragent.parse(userAgent);

  const browser = agent.toAgent();
  const device = agent.device.toString();

  const infoLog = {
    ip: ip,
    userAgent: userAgent,
    agent: agent,
    browser: browser,
    device: device,
  }


  if (token) {
    jwt.verify(token, config.jwtSecret, (err, user) => {

      // console.log(user);

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
                fullname: user.fullname,
                email: user.email,
                employee_id: user.employee_id,
                placement_id: user.placement_id,
                lat: user.lat,
                lon: user.lon,
                placement_name: user.placement_name
              }, config.jwtSecret, { expiresIn: '300s' });
            // res.cookie('token', newAccessToken, { httpOnly: true });

            res.cookie('token', newAccessToken, {
              httpOnly: true,
              secure: true,
              maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });


            req.user = user;
            return next();
          });
        } else {
          return res.redirect(baseUrl + '/auth/login');
        }
      } else if (err) {
        logger.error('Failed to authenticate token', { error: err });
        return res.redirect(baseUrl + '/auth/login');
      } else {
        req.user = user;
        logger.info('User authenticated', { user: req.user, info: infoLog });
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
