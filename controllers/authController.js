const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../database');
const baseUrl = config.baseUrl;

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute(`SELECT a.id, a.username, b.placement_id, 
        b.fullname, b.email, a.employee_id,
        c.lat, c.lon, c.name as placement_name
        FROM users_master a
        INNER JOIN employee b ON a.employee_id = b.id
        INNER JOIN placement_master c ON b.placement_id = c.id
        WHERE a.username = ? AND a.password = ?`, [username, password]);

        if (rows.length > 0) {
            const user = rows[0];

            console.log(user);

            const token = jwt.sign(user, config.jwtSecret, { expiresIn: '300s' });
            const refreshToken = jwt.sign(user, config.jwtRefreshSecret, { expiresIn: '7d' });
            // res.cookie('token', token, { httpOnly: true });
            // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });


            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 300 * 1000 // 5 minutes in milliseconds
            });
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });



            let defaultUrl = baseUrl + '/dashboard';

            if (req.cookies.originalUrl) {
                defaultUrl = req.cookies.originalUrl
            }

            return res.redirect(defaultUrl);
        } else {
            let response = {
                title: 'Login',
                error: 'Invalid username or password',
                username: username,
                password: password,
            }
            return res.status(401).render('sign-in', response);
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).render('sign-in', { title: 'Login', error: 'An error occurred, please try again later' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(baseUrl + '/auth/login');
};
