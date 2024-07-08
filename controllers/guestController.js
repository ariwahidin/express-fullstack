const renderWithLayout = require('../helpers/renderWithLayout');

exports.getOrder = (req, res) => {
    return renderWithLayout(res, 'guest/order', { title: 'Order' });
};
