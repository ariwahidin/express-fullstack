const db = require('../database');
const moment = require('moment-timezone');

exports.saveAttendance = async (dataToSave) => {

    const timestamp = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const query = 'INSERT INTO attendance (user_id, latitude, longitude, photo_path, time, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    try {
        const [results] = await db.query(query, [dataToSave.user_id, dataToSave.latitude, dataToSave.longitude, dataToSave.photoPath, timestamp, dataToSave.status, dataToSave.user_id]);
        return results;
    } catch (err) {
        throw err;
        console.log(err);
    }
};

// Fungsi baru untuk mendapatkan semua data absensi
exports.getAllAttendances = async () => {
    const query = 'SELECT * FROM attendance ORDER BY created_at DESC';
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (err) {
        throw err;
    }
};

exports.myAttendanceToday = async (user_id, today) => {
    const query = `SELECT * FROM attendance WHERE user_id = ? AND DATE_FORMAT(time, '%Y-%m-%d') = ?`;
    try {
        const [rows] = await db.query(query, [user_id, today]);
        return rows;
    } catch (err) {
        throw err;
    }
};

exports.cekAttendanceIn = async (employee_id) => {
    const query = `SELECT * FROM employee_attendance WHERE employee_id = ? AND DATE(date) = DATE(NOW()) AND clock_in IS NOT NULL`;
    try {
        const [rows] = await db.query(query, [employee_id]);
        return rows;
    } catch (err) {
        throw err;
    }
};

exports.getMyAttendance = async (employee_id) => {
    const query = `SELECT employee_id, date, clock_in AS time, photo_path_in AS photo_path, 'in' AS status
                FROM employee_attendance WHERE employee_id = ? AND DATE(date) = DATE(NOW()) AND clock_in IS NOT NULL
                UNION ALL
                SELECT employee_id, date, clock_out AS time, photo_path_out AS photo_path, 'out' AS status
                FROM employee_attendance WHERE employee_id = ? AND DATE(date) = DATE(NOW()) AND clock_out IS NOT NULL`;
    try {
        const [rows] = await db.query(query, [employee_id, employee_id]);
        return rows;
    } catch (err) {
        throw err;
    }
};

exports.getAllPlacement = async () => {
    const query = `SELECT * FROM placement_master`;
    try {
        const rows = await db.query(query);
        return rows;
    } catch (err) {
        throw err;
    }
};

exports.getShiftId = async (employee_id) => {
    const query = `SELECT shift_id FROM employee_schedules WHERE employee_id = ?
		  AND DATE(schedule_date) = DATE(NOW()) LIMIT 1`;
    try {
        const [rows] = await db.query(query, [employee_id]);
        return rows;
    } catch (err) {
        console.log(err)
        throw err;
    }
}
exports.clockIn = async (dataToSave) => {

    const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const currentTime = moment().tz("Asia/Jakarta").format("HH:mm:ss");

    const timestamp = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const query = 'INSERT INTO employee_attendance (employee_id, date,  shift_start_time, shift_end_time, clock_in, latitude_in, longitude_in, photo_path_in, shift_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [results] = await db.query(query, [
            dataToSave.employee_id,
            currentDate,
            dataToSave.shift_start_time,
            dataToSave.shift_end_time,
            currentTime,
            dataToSave.latitude,
            dataToSave.longitude,
            dataToSave.photoPath,
            dataToSave.shiftId]
        );
        
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.clockOut = async (dataToSave) => {

    const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const currentTime = moment().tz("Asia/Jakarta").format("HH:mm:ss");

    const timestamp = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    const query = `UPDATE employee_attendance SET clock_out = ?, latitude_out = ?, longitude_out = ?, photo_path_out = ? WHERE employee_id = ? AND date = ?`;
    try {
        const [results] = await db.query(query, [
            currentTime,
            dataToSave.latitude,
            dataToSave.longitude,
            dataToSave.photoPath,
            dataToSave.employee_id,
            currentDate]
        );
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.getMySchedule = async (employee_id) => {
    const query = `SELECT a.employee_id, b.shift_name, b.start_time, b.end_time,
                c.fullname
                FROM employee_schedules a 
                INNER JOIN shifts b ON a.shift_id = b.id
                INNER JOIN employee c ON a.employee_id = c.id
                WHERE employee_id = ? 
                AND schedule_date = DATE(NOW()) LIMIT 1`;
    try {
        const [rows] = await db.query(query, [employee_id]);
        return rows;
    } catch (err) {
        throw err;
    }
}