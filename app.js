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

// make a new application
var app = express();

app.use (cookieParser());

app.get ('/', function(req, res) {
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
});



app.listen(3000,function(){
    console.log('sample app listening on port 3000!');
});
