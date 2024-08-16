const db = require('../database');


exports.saveAttendance = async (latitude, longitude, photoPath) => {
    const query = 'INSERT INTO attendance (latitude, longitude, photo_path) VALUES (?, ?, ?)';
    try {
        const [results] = await db.query(query, [latitude, longitude, photoPath]);
        return results;
    } catch (err) {
        throw err;
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