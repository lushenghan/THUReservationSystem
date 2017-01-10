var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var accounts = require('./routes/accounts');
var info_accounts = require('./routes/info_accounts');
var reservations = require('./routes/reservations');
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'AshTestSession',
    cookie: {maxAge: 600 * 1000},  //暂定有效期为10分钟
    resave: false,
    saveUninitialized: true
}));

module.exports = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', index);
app.use('/reservations', reservations);
app.use('/accounts', accounts);
app.use('/info_accounts', info_accounts);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


