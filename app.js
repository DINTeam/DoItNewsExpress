let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const asyncify = require('express-asyncify');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOption = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const session = require("express-session");

const app = asyncify(express());

let tokenMiddleWare = require('./utils/tokenAuth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(tokenMiddleWare);

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const swaggerSpec = swaggerJSDoc(swaggerOption);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

<<<<<<< HEAD
=======
app.use(session({
  key : 'sid',
  secret : 'secret',
  resave : false,
  saveUninitialized : true,
  cookie : {
    maxAge : 24000 * 60 * 60
  }
}));

>>>>>>> e1abce39c42f61861e8253164f433da59157cd57
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
