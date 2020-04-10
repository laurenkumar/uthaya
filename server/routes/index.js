module.exports = function (app) {
    app.use('/', require('./home'));
    app.use('/traduction', require('./traduction'));
    app.use('/cours', require('./cours'));
    app.use('/ateliers', require('./ateliers'));
    app.use('/presentation', require('./presentation'));
    app.use('/boutique', require('./boutique'));
    app.use('/*', require('./home'));
};
