"use strict";

var express = require('express'),
    csrf = require('csurf'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),

    User = require('./account/models').User,

    blog_routes = require('./blog/routes'),
    account_routes = require('./account/routes'),
    users = require('./routes/users'),

    app = express(),

    /* Passport configuration */
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


require('./helpers')(app);


passport.use(new LocalStrategy({usernameField: 'u', passwordField: 'pw'},
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            
            return done(null, user);
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist/')));
app.use(express.static(path.join(__dirname, 'bower_components/moment/min/')));
app.use(express.static(path.join(__dirname, 'bower_components/')));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // functionality provided by npm/qs


// See https://github.com/expressjs/method-override
var methodOveride = require('method-override');
app.use(methodOveride('_method'));
app.use(methodOveride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));


app.use(cookieParser());

var sessionStore = new session.MemoryStore();

app.use(session({

    secret: 'Simple Example',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
    store: sessionStore
    
}));

app.use(csrf());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// some locals in templates
app.use(function (req, res, next) {
    res.locals.csrf_field = 
        '<input type="hidden" name="_csrf" value="' + 
        req.csrfToken() + '">';
    res.locals.user = req.user;
    res.locals.msgs = req.flash();
    next();
});


app.use('/', blog_routes);
app.use('/', account_routes);
require('./routes/page')(app)

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
