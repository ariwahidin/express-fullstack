const renderWithLayout = require('../helpers/renderWithLayout');
const db = require('../database');

exports.getOrder = async (req, res) => {
    const user = req.user ? req.user : req.user = { username: 'Guest' };
    console.log(req.user);
    console.log(user);
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
            console.log(result);
            return renderWithLayout(res, 'guest/order', { user, title: 'Cari Order (Guest)', order: result });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    } else {
        return renderWithLayout(res, 'guest/order', { user, title: 'Cari Order (Guest)', order: [] });
    }

};

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
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

exports.saveOrderStatus = async (req, res) => {
    const { spk, ship_to, delivery_no, lokasi_terkini, status, user_lat, user_lon, user_address, user_name } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // const db = getDbConnection(spk);

    // if (!db) {
    //     return res.status(400).json({ success: false, message: 'Invalid SPK provided' });
    // }

    const where = {
        order_id: spk,
        ship_to: ship_to,
        order_status: 'goods arrived'
    };

    try {
        const checkQuery = `SELECT * FROM order_d_status WHERE order_id = ? AND ship_to = ? AND order_status = 'goods arrived'`;
        const [rows] = await db.execute(checkQuery, [spk, ship_to]);

        if (rows.length < 1) {
            const query = `
                INSERT INTO order_d_status (
                    order_id, ship_to, delivery_no, lokasi_terkini, 
                    order_status, lat, lon, address, created_date, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                spk, ship_to, delivery_no, lokasi_terkini,
                status, user_lat, user_lon, user_address,
                date, user_name
            ];

            try {
                const [results] = await db.execute(query, values);
                res.json({ success: true, message: 'Order status updated successfully' });
            } catch (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ success: false, message: 'Error executing query' });
            }
            return;
        }


        res.status(200).json({ success: false, messages: 'Barang sampai sudah pernah di isi' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}
