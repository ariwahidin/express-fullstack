const { baseUrl } = require("../config");

module.exports = function renderView(res, view, options) {
    options = options || {};
    // console.log(res.req.user);
    // console.log(baseUrl);

    // console.log(res.req.ip);
    try {
        // Cek apakah permintaan adalah AJAX
        const fullUrl = res.req.protocol + '://' + res.req.get('host') + res.req.originalUrl;

        if (res.req.xhr) {
            // Jika permintaan adalah AJAX, render view sebagai string HTML dan kirim sebagai JSON
            res.render(view, options, (err, html) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Gagal merender content' });
                    return;
                }
                res.status(200).json({ success: true, content: html, user: res.req.user });
            });
        } else {
            // Jika permintaan bukan AJAX, render seluruh halaman dengan layout
            // options.layout = options.layout || 'desktop/template';
            // res.render(options.layout, options);
            res.redirect(baseUrl + '/desktop');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil content' });
    }
};

