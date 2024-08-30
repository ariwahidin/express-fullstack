const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const locationRoutes = require('./routes/locationRoutes');
const guestController = require('./routes/guestRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const desktopRoutes = require('./routes/desktopRoutes');
const logRequestInfo = require('./middleware/logInfo'); // Import middleware
const logger = require('./utils/logger'); // Import logger

const app = express();

const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io', {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});
// const io = socketIo(server);

const io = socketIo(server, {
    path: '/py-express/socket.io' // Atur path socket.io sesuai kebutuhan
});



const baseUrl = config.baseUrl;
app.locals.baseUrl = baseUrl; // agar bisa di akses di view


// Atur batas maksimal ukuran payload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(logRequestInfo); // Gunakan middleware untuk logging

// app.use(express.static(path.join(__dirname, 'public')));

app.use(baseUrl, express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Middleware untuk menambahkan io ke request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(baseUrl + '/', dashboardRoutes);
app.use(baseUrl + '/dashboard', dashboardRoutes);
app.use(baseUrl + '/order', orderRoutes);
app.use(baseUrl + '/location', locationRoutes);
app.use(baseUrl + '/auth', authRoutes);
app.use(baseUrl + '/guest', guestController);
app.use(baseUrl + '/attendance', attendanceRoutes);


// desktop
app.use(baseUrl + '/desktop', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
}, desktopRoutes);


// API for Asics
// app.use(baseUrl + '/api/asics');

server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
