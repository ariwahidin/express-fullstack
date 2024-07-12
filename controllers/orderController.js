const moment = require('moment');
const db = require('../database');
const renderWithLayout = require('../helpers/renderWithLayout');

exports.index = (req, res) => {
    const user = req.user;
    return renderWithLayout(res, 'order/index', { user: user, title: 'Order' });
};

exports.getorder = async (req, res) => {
    const { search } = req.body;
    let sql = `
        SELECT a.order_id, a.ship_to, a.delivery_no, a.destination_city, 
        b.cust_name, b.cust_addr1, c.order_date
        FROM order_d a
        INNER JOIN customer b ON a.ship_to = b.cust_id
        INNER JOIN order_h c ON a.order_id = c.order_id
    `;

    const params = [];

    if (search) {
        sql += `
            WHERE a.delivery_no LIKE ? 
            OR b.cust_name LIKE ? 
            OR a.order_id LIKE ?
        `;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += `
        GROUP BY a.ship_to 
        ORDER BY c.order_date DESC
    `;

    try {
        const [rows] = await db.execute(sql, params);

        // Format tanggal
        rows.forEach(order => {
            order.order_date = moment(order.order_date).format('YYYY-MM-DD');
        });


        // Render template EJS menjadi string
        res.render('order/list_order', { orders: rows }, (err, html) => {
            if (err) {
                console.error('Render error:', err);
                return res.status(500).json({ success: false, message: 'An error occurred while rendering the table.' });
            }
            res.status(200).json({ success: true, content: html });
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the orders.' });
    }

};
