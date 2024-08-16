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

exports.getOrdersWithDetail = async (req, res) => {
    const date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    const sql = `SELECT a.id, a.order_id, a.lat, a.lon, a.address, a.created_at,
                b.ship_to, c.cust_name, b.delivery_no
                FROM order_h_status a
                LEFT JOIN order_d b ON a.order_id = b.order_id
                LEFT JOIN customer c ON b.ship_to = c.cust_id`;
    try {
        const [results] = await db.execute(sql);
        orders = {};
        results.forEach(row => {

            if(!orders[row.order_id]){
                orders[row.order_id] = {
                    order_id : row.order_id,
                    id : row.id,
                    lat: row.lat,
                    lon : row.lon,
                    address : row.address,
                    created_at : row.created_at,
                    order_detail : []
                }
            };
            orders[row.order_id].order_detail.push({
                ship_to : row.ship_to,
                cust_name : row.cust_name,
                delivery_no : row.delivery_no
            });
        });
        res.json({ success: true, data: Object.values(orders) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
}
