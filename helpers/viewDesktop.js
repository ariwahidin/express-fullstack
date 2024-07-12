module.exports = function viewDesktop(res, view, options) {
    options = options || {};
    options.layout = options.layout || 'desktop/template';
    options.body = view;

    res.render(options.layout, options);
};