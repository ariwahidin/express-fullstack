const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../database');
const baseUrl = config.baseUrl;

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ? AND pass = ?', [username, password]);

        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.redirect(baseUrl + '/dashboard');
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
