let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const asyncify = require('express-asyncify');
var router = express.Router();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOption = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const session = require("express-session");

const app = asyncify(express());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/portfolio',require('./routes/portfolio'));

app.use('/', router);
app.use('/search_history',require('./routes/search_history'));
app.use('/article',require('./routes/article'));
app.use('/portfolio',require('./routes/portfolio'));
app.use('/scrab',require('./routes/scrab'));
app.use('/like',require('./routes/like'));
app.use('/coin',require('./routes/coin'));
app.use('/comment',require('./routes/comment'));
app.use('/category',require('./routes/category'));
app.use('/mypage',require('./routes/mypage'));
app.use('/auth',require('./routes/auth'));

const swaggerSpec = swaggerJSDoc(swaggerOption);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(session({
  key : 'sid',
  secret : 'secret',
  resave : false,
  saveUninitialized : true,
  cookie : {
    maxAge : 24000 * 60 * 60
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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