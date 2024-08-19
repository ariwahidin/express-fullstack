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

exports.cekAttendance = async (user_id, date) => {
    const query = `SELECT * FROM attendance WHERE user_id = ? AND DATE_FORMAT(time, '%Y-%m-%d') = ?`;
    try {
        const [rows] = await db.query(query, [user_id, date]);
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