const renderWithLayout = require('../helpers/renderWithLayout');

exports.dashboard = (req, res) => {
    return renderWithLayout(res, 'category', { title: 'Dashboard' });
};
