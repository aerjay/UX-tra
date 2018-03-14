// imports
var express = require('express');
//var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://toconnect:connect@ds113169.mlab.com:13169/uxtra')
    .then(() =>  console.log('db: connection successful'))
    .catch((err) => console.error(err));

//Use this space to indicate routes

// make a new application
var app = express();


//'app.use' section of the file 
//app.use (cookieParser());
app.use(require('express-session')({
    secret: 'keke',
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
   
// this code exactly follows the site
// https://www.djamware.com/post/58bd823080aca7585c808ebf/nodejs-expressjs-mongoosejs-and-passportjs-authentication
// to add passport configuration

let User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//The below is commented out as we will not be using this part for authentication anymore. 
/* app.get ('/', function(req, res) {
    //we have to go to home page first = log in screen
    res.sendFile('index.html', {root: __dirname});
    // check existing cookies
    console.log("Cookies :  ", req.cookies);
//
    var logIn = cookieParser.JSONCookies(req.cookies);

    let userName ="";
    let password = "";
    if (logIn.length !== 0) {
        userName = JSON.stringify(logIn["uname"]);
        password = JSON.stringify(logIn["pass"]);
        }
        
    //authenication of user
    let defaultUser = JSON.stringify("admin");
    let defaultPass = JSON.stringify("1234");

    if((userName === defaultUser) && (password === defaultPass)){
        console.log("succ");
    }
    //if the user is allowed then redirect
    //else go to login


    // set a new cookie that will last 1 hr
    //   res.cookie ("user", "bob", { maxAge: 60 * 60 * 1000 });


    //check if user logs out
    // clear a cookie (logout)
    res.clearCookie("uname");
    res.clearCookie("pass");
    if(logIn.length != 2) {
        res.clearCookie("fname");
        res.clearCookie("lname");
        res.clearCookie("passion");
        res.clearCookie("email");
    }
}); */



app.listen(3000,function(){
    console.log('sample app listening on port 3000!');
