const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const multer = require('multer')
const errorHandler = require('errorhandler')

const routes = require('../routes/index')

module.exports = app => {
    //Setting 
    app.set('port', process.env.PORT || 3000)
    app.set('views', path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('./helpers')
    }));
    app.set('view engine', '.hbs');

    //Middleware
    app.use(morgan('dev'));
    app.use(multer({
        dest: path.join(__dirname, '../public/upload/temp')
    }).single('image_hbs'))
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    //Routes
    routes(app);

    //Public
    app.use('/public', express.static(path.join(__dirname, '../public')));

    //Error handlers
    if ('development' === app.get('env')) {
        app.use(errorHandler)
    }

    return app;
}