const renderWithLayout = require('../helpers/renderWithLayout');
const moment = require('moment-timezone');
const db = require('../database');
const fs = require('fs');
const path = require('path');
const attendanceModel = require('../models/attendanceModel');



exports.getAttendance = async (req, res) => {

    console.log(req.user);

    const user = req.user ? req.user : req.user = { username: 'Guest' };
    if (req.query.spk) {
        try {
            const spk = req.query.spk;
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
            const [result] = await db.execute(sql, [spk]);
            return renderWithLayout(res, 'attendance/index', {user, title: 'Record Attendance', order: result });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    } else {
        return renderWithLayout(res, 'attendance/index', {user, title: 'Record Attendance', order: [] });
    }

};


exports.submitAttendance = (req, res) => {
    const { latitude, longitude, photo } = req.body;

    // console.log('essss');
    // console.log(req.body);

    // Decode base64 photo
    const base64Data = photo.replace(/^data:image\/png;base64,/, "");
    const photoPath = `images/${Date.now()}.png`;

    // Save photo to server
    fs.writeFile(path.join(__dirname, '..', 'public', photoPath), base64Data, 'base64', async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save photo.' });
        }

        // Save attendance to database
        try {
            await attendanceModel.saveAttendance(latitude, longitude, photoPath);
            res.json({ success: true, message: 'Attendance recorded successfully.' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to save attendance.' });
        }
    });
};


// Fungsi baru untuk mendapatkan semua data absensi
exports.getAttendanceCards = async (req, res) => {
    try {
        const rows = await attendanceModel.getAllAttendances();
        res.json(rows); // Mengirim data sebagai JSON
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve attendance list.' });
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
