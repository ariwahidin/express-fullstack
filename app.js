const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const baseUrl = config.baseUrl;
app.locals.baseUrl = baseUrl; // agar bisa di akses di view

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(baseUrl + '/', dashboardRoutes);
app.use(baseUrl + '/dashboard', dashboardRoutes);
app.use(baseUrl + '/order', orderRoutes);
app.use(baseUrl + '/location', locationRoutes);
app.use(baseUrl + '/auth', authRoutes);
console.log(baseUrl);



app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
