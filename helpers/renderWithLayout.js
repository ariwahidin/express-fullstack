module.exports = function renderWithLayout(res, view, options) {
    options = options || {};
    options.layout = options.layout || 'template';
    options.body = view;

    res.render(options.layout, options);
};
