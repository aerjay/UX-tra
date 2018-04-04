var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var sessionStore = require('connect-mongo')(session);
var passportSocketIo = require('passport.socketio');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Router = require('./routes/route');
var bodyParser = require('body-parser');
var fileupload = require("express-fileupload");
var flash    = require('connect-flash');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.set('Myserver',http);
//needs to remove sometime lols
app.set('socketio', io);

var events = require('./events/event')(io);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://toconnect:connect@ds113169.mlab.com:13169/uxtra')
	.then(() =>  console.log("db: connection successful"))
	.catch((err) => console.error(err));
var storeInstance = new sessionStore({mongooseConnection: mongoose.connection});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash()); 
app.use(session({
	store: storeInstance,
	secret: 'userexperience',
	resave: false,
	unset: 'destroy',
	saveUninitialized: false
}));

io.use(passportSocketIo.authorize({
	store: storeInstance,
	secret: 'userexperience'
}));

app.use(passport.initialize());
app.use(passport.session());

//added the db
var User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(fileupload({ limits: { filesize: 15 * 1024 *1024}, safeFileNames: true, preserveExtension: true, abortOnLimit: true}));
// view engine setup
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');
app.use('/', Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err.status
	});
});

module.exports = app;
