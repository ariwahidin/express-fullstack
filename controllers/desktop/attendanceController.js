const viewDesktop = require('../../helpers/viewDesktop');
const renderView = require('../../helpers/renderView');
const moment = require('moment-timezone');
const db = require('../../database');

exports.indexOld = (req, res) => {
    return viewDesktop(res, 'attendance/index', { title: 'Attendance', user: req.user });
};

exports.index = (req, res) => {
    console.log(req.user);
    return renderView(res, 'desktop/attendance/index', { title: 'Attendance', user: req.user });
};

exports.getAttendance = async (req, res) => {
    try {
        let sql = `SELECT a.id, a.employee_id, b.fullname, a.date, a.clock_in, a.clock_out,
            a.shift_start_time, a.shift_end_time, c.shift_name  
            FROM employee_attendance a
            INNER JOIN employee b ON a.employee_id = b.id
            INNER JOIN shifts c ON a.shift_id = c.id`;
        const [results] = await db.execute(sql);


        // Render tabel sebagai string HTML menggunakan EJS
        res.render('desktop/attendance/table_attendance', { attendanceData: results }, (err, html) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Gagal merender tabel' });
                return;
            }
            // Kirim HTML tabel sebagai respons JSON
            res.status(200).json({ success: true, table: html });
        });



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Gagal mengambil data kehadiran' });
    }
};

exports.getOvertime = async (req, res) => {
    try {
        let sql = `SELECT a.id, c.fullname, b.date, a.overtime_start, a.overtime_end,
        a.duration_minutes, a.status  
        FROM employee_overtime a
        INNER JOIN employee_attendance b ON a.attendance_id = b.id
        INNER JOIN employee c ON a.employee_id = c.id`;
        const [results] = await db.execute(sql);


        // Render tabel sebagai string HTML menggunakan EJS
        res.render('desktop/attendance/table_overtime', { attendanceData: results }, (err, html) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Gagal merender tabel' });
                return;
            }
            // Kirim HTML tabel sebagai respons JSON
            res.status(200).json({ success: true, table: html });
        });



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Gagal mengambil data kehadiran' });
    }
};

exports.approveOrRejectOvertime = async (req, res) => {
    const overtimeId = req.body.overtimeId;
    const status = req.body.status; // 'approved' or 'rejected'

    // console.log(req.body);
    // console.log(req.user);

    // return;

    try {   
        const [overtime] = await db.execute('SELECT * FROM employee_overtime WHERE id = ?', [overtimeId]);

        if (overtime.length === 0) {
            return res.status(404).json({ message: "Overtime record not found." });
        }

        await db.execute('UPDATE employee_overtime SET status = ? WHERE id = ?', [status, overtimeId]);

        res.status(200).json({ message: `Overtime has been ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during overtime approval." });
    }
};