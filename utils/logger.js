const winston = require('winston');
const path = require('path');

// Membuat folder log jika belum ada
const logDir = path.join(__dirname, '../logs');
const fs = require('fs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
    ],
});

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple(),
//     }));
// }

module.exports = logger;
