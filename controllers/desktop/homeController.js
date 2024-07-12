const viewDesktop = require('../../helpers/viewDesktop');

exports.home = (req, res) => {
    return viewDesktop(res, 'home', { title: 'Dashboard', user: req.user });
};
