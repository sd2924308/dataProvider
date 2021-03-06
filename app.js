var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// var db = 'mongodb://james:123456@localhost:27017/example'
// mongoose.connect('mongodb://localhost:27017/dataProviderDB',{useMongoClient:true})
mongoose.Promise = global.Promise;

mongoose.connection.openUri('mongodb://127.0.0.1:27017/dataProviderDB')

var index = require('./routes/index');
var users = require('./routes/users');
var news = require('./routes/news');
var sc = require('./routes/shoucang');
var sh = require('./routes/shenghuo');
var fix = require('./routes/fix');
var down = require('./routes/down');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/news', news);
app.use('/shoucang', sc);
app.use('/sh', sh);
app.use('/fix', fix);

app.use('/down', down);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
