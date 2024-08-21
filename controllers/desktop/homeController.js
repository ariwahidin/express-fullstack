const viewDesktop = require('../../helpers/viewDesktop');
const renderView = require('../../helpers/renderView');

exports.homeOld = (req, res) => {
    return viewDesktop(res, 'home', { title: 'Dashboard', user: req.user });
};

exports.index = (req, res) => {
    return viewDesktop(res, 'home', { title: 'Dashboard', user: req.user });
};

exports.home = async (req, res) => {
    const data = []; // Data yang akan dikirimkan ke view

    // Memanggil helper untuk merender view dan mengirimkannya sebagai JSON
    renderView(res, 'desktop/home', { data });
}