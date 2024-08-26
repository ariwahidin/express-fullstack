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

exports.employee = async (req, res) => {
    const [employees] = await db.execute('SELECT * FROM employee');
    const [shifts] = await db.execute('SELECT * FROM shifts');
    return renderView(res, 'desktop/attendance/employee', { user: req.user, employees: employees, shifts: shifts });
};


// Helper function to generate an array of dates between start and end dates
function getDates(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]); // Format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

exports.saveEmployeeShift = async (req, res) => {

    const { date, dateEnd, employee_id, shift } = req.body;
    // Validate the data
    if (!date || !dateEnd || !employee_id || !shift) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate dates array
    const dates = getDates(date, dateEnd);

    try {
        // Menggunakan map() untuk membuat array promises
        const promises = await dates.map(scheduleDate => {
            return db.execute(
                'INSERT INTO employee_schedules (employee_id, shift_id, schedule_date) VALUES (?, ?, ?)',
                [employee_id, shift, scheduleDate]
            );
        });

        // Tunggu hingga semua operasi penyimpanan selesai
        await Promise.all(promises);

        res.status(201).json({ message: 'Schedules saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving schedules', error });
    }
}

exports.getEmployeeSifts = async (req, res) => {
    const { yearMonth } = req.body;

    console.log(yearMonth);

    const [schedules] = await db.execute(`SELECT a.employee_id, a.schedule_date, a.shift_id, b.shift_name
    FROM employee_schedules a
    INNER JOIN shifts b ON a.shift_id = b.id
    WHERE DATE_FORMAT(a.schedule_date, '%Y-%m') = ?`, [yearMonth]);
    res.status(200).json({ schedules });
}