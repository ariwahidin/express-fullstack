const renderWithLayout = require('../helpers/renderWithLayout');
const moment = require('moment-timezone');
const db = require('../database');
const fs = require('fs');
const path = require('path');
const attendanceModel = require('../models/attendanceModel');



exports.getAttendance = async (req, res) => {

    const user = req.user ? req.user : req.user = { username: 'Guest' };
    const schedule = await attendanceModel.getMySchedule(req.user.employee_id);

    try {
        await renderWithLayout(res, 'attendance/index', { user, title: 'Record Attendance', schedule: schedule[0] });
    } catch (error) {
        console.log(error);
        throw error;
    }
};


exports.submitAttendance = async (req, res) => {

    const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const currentTime = moment().tz("Asia/Jakarta").format("HH:mm:ss");

    const { latitude, longitude, photo } = req.body;
    let user_id = req.user.id;

    // Decode base64 photo
    const base64Data = photo.replace(/^data:image\/png;base64,/, "");
    const photoPath = `images/${Date.now()}.png`;

    const dateNow = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');
    let status = 'in';

    // Save photo to server
    fs.writeFile(path.join(__dirname, '..', 'public', photoPath), base64Data, 'base64', async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save photo.' });
        }

        try {
            const rows = await attendanceModel.cekAttendanceIn(req.user.employee_id);
            if (rows.length > 0) {
                status = 'out';
            }

            let shiftId = await attendanceModel.getShiftId(req.user.employee_id);




            // Dapatkan shift_end_time dari tabel employee_shifts
            const [shift] = await db.execute(
                `SELECT b.start_time, b.end_time FROM employee_schedules a
                INNER JOIN shifts b ON a.shift_id = b.id
                WHERE a.employee_id = ? AND schedule_date = DATE(NOW()) LIMIT 1`,
                [req.user.employee_id]
            );

            if (shift.length === 0) {
                return res.status(400).json({ message: "No shift scheduled for today." });
            }


            if (status === 'in') {
                await attendanceModel.clockIn({ employee_id: req.user.employee_id, latitude, longitude, photoPath, status, shiftId: await shiftId[0].shift_id, shift_start_time: shift[0].start_time, shift_end_time: shift[0].end_time });
            } else {

                const [rows] = await db.execute(
                    'SELECT * FROM employee_attendance WHERE employee_id = ? AND date = ? AND clock_in IS NOT NULL',
                    [req.user.employee_id, currentDate]
                );

                if (rows.length === 0) {
                    return res.status(400).json({ message: "You have not clocked in yet." });
                }

                const attendance = rows[0];

                await attendanceModel.clockOut({ employee_id: req.user.employee_id, latitude, longitude, photoPath, status, shiftId: await shiftId[0].shift_id });


                // Cek apakah overtime terjadi (melebihi jam kerja shift)
                const shiftEndTime = moment(attendance.shift_end_time, "HH:mm:ss");
                const clockOutTime = moment(currentTime, "HH:mm:ss");


                if (clockOutTime.isAfter(shiftEndTime)) {
                    const overtimeDuration = clockOutTime.diff(shiftEndTime, 'minutes');
        
                    // Insert ke table employee_overtime jika overtime terjadi
                    await db.execute(
                        'INSERT INTO employee_overtime (attendance_id, employee_id, overtime_start, overtime_end, duration_minutes, status) VALUES (?, ?, ?, ?, ?, ?)',
                        [attendance.id, req.user.employee_id, shiftEndTime.format("HH:mm:ss"), clockOutTime.format("HH:mm:ss"), overtimeDuration, 'pending']
                    );
                }
            }

            res.json({ success: true, message: 'Attendance recorded successfully.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve attendance list.' });
        }
    });
};


// Fungsi baru untuk mendapatkan semua data absensi
exports.getAttendanceCards = async (req, res) => {
    let user_id = req.user.id;
    let today = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');
    try {
        const rows = await attendanceModel.getMyAttendance(req.user.employee_id);
        res.json(rows); // Mengirim data sebagai JSON
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve attendance list.' });
    }
};

exports.clockIn = async (req, res) => {
    const employeeId = req.body.employeeId;
    const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const currentTime = moment().tz("Asia/Jakarta").format("HH:mm:ss");

    try {
        // Check if employee has already clocked in today
        const [rows] = await db.execute(
            'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
            [employeeId, currentDate]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "You have already clocked in today." });
        }

        // Insert clock_in time
        await db.execute(
            'INSERT INTO employee_attendance (employee_id, date, clock_in, shift_id) VALUES (?, ?, ?, ?)',
            [employeeId, currentDate, currentTime, req.body.shiftId]
        );

        res.status(200).json({ message: "Clock In successful." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during Clock In." });
    }
};











// ============================================================================================


exports.getOrderBySPK = async (req, res) => {
    const spk = req.body.spk;
    console.log(spk);
    try {
        const sql = `SELECT DISTINCT a.order_id, a.delivery_no, a.ship_to, a.destination_city, 
        b.cust_name, b.cust_addr1,
        (SELECT order_status FROM order_d_status 
        WHERE order_id = a.order_id 
        AND ship_to = a.ship_to
        AND order_status = 'truck_arrival'
        ) AS arrival_status,
        (SELECT order_status FROM order_d_status 
        WHERE order_id = a.order_id 
        AND ship_to = a.ship_to
        AND order_status = 'truck_unloading'
        ) AS unloading_status
        FROM order_d a
        INNER JOIN customer b ON a.ship_to = b.cust_id
        WHERE a.order_id = ?
        GROUP BY a.ship_to`;

    } catch (error) {

    }
};

exports.getOrderStatus = async (req, res) => {
    console.log(req.body);
    const { order_id, ship_to } = req.body;
    const sql = `SELECT * FROM order_d_status WHERE order_id = ? AND ship_to = ?`;

    try {
        const [rows] = await db.execute(sql, [order_id, ship_to]);

        rows.forEach(item => {
            item.created_date = moment.utc(item.created_date).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        });

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

exports.saveOrderStatus = async (req, res) => {

    const imagePath = req.file.path;
    const { spk, ship_to, delivery_no, lokasi_terkini, status, user_lat, user_lon, user_address, user_name } = req.body;
    const date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    // const where = {
    //     order_id: spk,
    //     ship_to: ship_to,
    //     order_status: 'goods arrived'
    // };

    try {
        // const checkQuery = `SELECT * FROM order_d_status WHERE order_id = ? AND ship_to = ? AND order_status = 'goods arrived'`;
        // const [rows] = await db.execute(checkQuery, [spk, ship_to]);

        // if (rows.length < 1) {
        const query = `
                INSERT INTO order_d_status (
                    order_id, ship_to, delivery_no, lokasi_terkini, 
                    order_status, lat, lon, address, created_date, created_by, image_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        const values = [
            spk, ship_to,
            delivery_no,
            lokasi_terkini,
            status,
            user_lat,
            user_lon,
            user_address,
            date,
            user_name,
            imagePath
        ];

        try {
            const [results] = await db.execute(query, values);
            res.json({ success: true, message: 'Order status updated successfully' });
        } catch (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ success: false, message: 'Error executing query' });
        }
        return;
        // }


        // res.status(200).json({ success: false, messages: 'Barang sampai sudah pernah di isi' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

exports.sendLocation = async (req, res) => {
    // console.log(req.body);

    const { spk, lat, lon, address } = req.body;
    const date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');



    try {

        const qryCek = `SELECT order_id FROM order_h WHERE order_id = ? LIMIT 1`;
        const [hasil] = await db.execute(qryCek, [spk]);

        if (hasil.length > 0) {
            const checkQuery = `SELECT * FROM order_h_status WHERE order_id = ? AND lat = ? AND lon = ? AND created_at = ?`;
            const [rows] = await db.execute(checkQuery, [spk, lat, lon, date]);

            if (rows.length < 1) {
                const query = `
                INSERT INTO order_h_status (
                    order_id, lat, lon, address, 
                    created_at
                ) VALUES (?, ?, ?, ?, ?)
            `;

                const values = [
                    spk,
                    lat, lon, address, date
                ];

                try {
                    console.log('Order location status updated successfully');
                    const [results] = await db.execute(query, values);
                    req.io.emit('updateArmadas');
                    // res.send('Armada added and clients notified');
                    res.json({ success: true, message: 'Order location status updated successfully' });
                } catch (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ success: false, message: 'Error executing query' });
                }
                return;
            } else {
                console.log('Order location status not updated');
            }
        } else {
            console.log('order id not exists');
            res.status(500).json({ success: false, message: 'order id not exists' });
        }




        // res.status(200).json({ success: false, messages: 'Barang sampai sudah pernah di isi' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }

};
