var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var friends = require('./routes/friends');
var borrow = require('./routes/borrow');
var products = require('./routes/products');

var models = require('./models');
models.sequelize.sync();
//models.sequelize.sync({force:true});

var passport = require('passport');
var config = require('./config/auth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var authentification = require('./routes/authentification');

var app = express();

passport.use('facebook', new FacebookStrategy({
  clientID        : config.facebook.clientID,
  clientSecret    : config.facebook.clientSecret,
  callbackURL     : config.facebook.callbackURL,
  profileFields: ['id', 'emails', 'name']
},
function(access_token, refresh_token, profile, done) {
  process.nextTick(function() {
      users.findOne({ 'lastname' : profile.emails[0].value }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          if (err)
            return done(err);
          else
            return done(null, user);
        } else {
          if (err)
            return done(err);
          users.register(new users({ username : profile.emails[0].value }), profile.id, function(err, user) {
            if (err)
              return done(err);
            else
              return done(null, user);
          });
        }
      });
    });
  }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/friends', friends);
app.use('/borrow', borrow);
app.use('/products', products);
app.use('/authentification/', authentification);


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
