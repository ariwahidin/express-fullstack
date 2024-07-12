const viewDesktop = require('../../helpers/viewDesktop');
const moment = require('moment-timezone');
const db = require('../../database');

exports.index = (req, res) => {
    return viewDesktop(res, 'armada', { title: 'Dashboard', user: req.user });
};

exports.getStatusArmada = async (req, res) => {
    try {
        const date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const sql = `SELECT 
                    a.id,
                    a.order_id,
                    a.lat,
                    a.lon,
                    a.address,
                    a.created_at,
                    c.trucker_id,
                    c.driver_name,
                    c.truck_no
                    FROM order_h_status a
                    INNER JOIN (SELECT order_id, MAX(created_at) AS latest FROM  order_h_status WHERE DATE(created_at) = ? GROUP BY order_id) b ON a.order_id = b.order_id AND a.created_at = b.latest
                    INNER JOIN order_h c ON a.order_id = c.order_id`;
        const [results] = await db.execute(sql, [date]);
        res.json({ success: true, data: results });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
}
