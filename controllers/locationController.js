const moment = require('moment');
const config = require('../config');
const db = require('../database');
const renderWithLayout = require('../helpers/renderWithLayout');
const baseUrl = config.baseUrl;

exports.search = (req, res) => {
    return renderWithLayout(res, 'location/search', { title: 'Search location' });
};

exports.getCustomer = async (req, res) => {
    const sql = "SELECT DISTINCT cust_id, cust_name FROM customer WHERE cust_id != ''";

    try {
        const [rows] = await db.execute(sql);
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the customers.'
        });
    }
};

exports.saveLocationCustomer = async (req, res) => {
    const { lat, lon, actual_location, cust_id } = req.body;

    const sql = `
        UPDATE customer 
        SET cust_addr4 = ?, cust_addr5 = ?, cust_addr6 = ? 
        WHERE cust_id = ?`; // pastikan bahwa kolom spk ada dalam tabel customer

    try {
        const [result] = await db.execute(sql, [lat, lon, actual_location, cust_id]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                success: true,
                message: 'Customer location updated successfully.'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Customer not found.'
            });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the customer location.'
        });
    }
}