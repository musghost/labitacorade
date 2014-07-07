var express = require('express'),
    compress = require('compression'),
    favicon = require('serve-favicon'),
    morgan  = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    expressValidator = require('express-validator');

module.exports = function(app, config) {
  
    app.use(compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(morgan({ format: 'dev', immediate: true }));
    app.use(bodyParser());
    app.use(expressValidator());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session( { 
        secret: '43thdggHGidy6r===_3:'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};
