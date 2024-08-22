const useragent = require('useragent');
const logger = require('../utils/logger'); // Import logger

const logRequestInfo = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const agent = useragent.parse(userAgent);

    // Ambil informasi dari User-Agent
    const browser = agent.toAgent();
    const device = agent.device.toString();

    // Log informasi
    logger.info('Request info', {
        ip,
        browser,
        device,
        url: req.originalUrl,
        method: req.method,
    });

    next();
};

module.exports = logRequestInfo;
