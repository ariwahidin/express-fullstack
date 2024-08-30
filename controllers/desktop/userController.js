const viewDesktop = require('../../helpers/viewDesktop');
const renderView = require('../../helpers/renderView');
const moment = require('moment-timezone');
const db = require('../../database');

exports.index = (req, res) => {
    return renderView(res, 'desktop/user/index', { title: 'User', user: req.user });
};

exports.create = async (req, res) => {

    const { fullname, username, password, email } = req.body;
    const dateNow = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');

    try {
        const [users] = await db.execute(`SELECT * FROM users_master WHERE username = ?`, [username]);

        if (users.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }


        const [employees] = await db.execute(`SELECT * FROM employee WHERE email = ?`, [email]);

        if (employees.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const [rows] = await db.execute(`INSERT INTO users_master (username, password) VALUES (?, ?)`, [username, password]);

        const [user1] = await db.execute(`SELECT * FROM users_master WHERE id = ?`, [rows.insertId]);

        const [employee] = await db.execute(`INSERT INTO employee (fullname, email, user_id, placement_id) VALUES (?, ?, ?, ?)`, [fullname, email, rows.insertId, 2]);

        const [updateUser] = await db.execute(`UPDATE users_master SET employee_id = ? WHERE id = ?`, [employee.insertId, rows.insertId]);

        // Send the results to the client
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: users,
            employee: employees,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving schedules', error });
    }
}

exports.getUserTable = async (req, res) => {
    try {
        let sql = `SELECT a.id, b.fullname, b.email, a.username, a.employee_id 
                    FROM users_master a
                    INNER JOIN employee b ON a.id = b.user_id`;
        const [results] = await db.execute(sql);


        // Render tabel sebagai string HTML menggunakan EJS
        res.render('desktop/user/user_table', { results }, (err, html) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Gagal merender tabel user' });
                return;
            }
            res.status(200).json({ success: true, table: html });
        });



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.body.user_id;

    try {
        await db.execute('DELETE FROM users_master WHERE id = ?', [userId]);
        await db.execute('DELETE FROM employee WHERE user_id = ?', [userId]);

        res.status(200).json({ success: true, message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user', error });
    }
}

exports.updateUser = async (req, res) => {
    console.log(req.body);

    const { fullname, user_id, username, email, password } = req.body;

    try {
        const [users] = await db.execute(`SELECT * FROM users_master WHERE username = ? AND id != ?`, [username, user_id]);

        if (users.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }


        const [employees] = await db.execute(`SELECT * FROM employee WHERE email = ? AND user_id != ?`, [email, user_id]);

        if (employees.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        if (password != '') {
            const [rows] = await db.execute(`UPDATE users_master SET username = ?, password = ? WHERE id = ?`, [username, password, user_id]);
        } else {
            const [rows] = await db.execute(`UPDATE users_master SET username = ? WHERE id = ?`, [username, user_id]);
        }

        const [user1] = await db.execute(`SELECT * FROM users_master WHERE id = ?`, [user_id]);

        const [employee] = await db.execute(`UPDATE employee SET fullname = ?, email = ? WHERE user_id = ?`, [fullname, email, user_id]);


        // Send the results to the client
        res.status(201).json({
            success: true,
            message: 'User updated successfully',
            user: users,
            employee: employees,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving schedules', error });
    }
}
