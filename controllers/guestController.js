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
