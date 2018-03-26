var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var Controller = {};

// Restrict access to root page
Controller.home = function(req, res) {   
//    res.render('test', {data: JSON.stringify("hey")});
    res.render('index');
};

// Post registration
Controller.doRegister = function(req, res) {
    User.register(new User({ username : req.body.username}), req.body.password, function(err, user) {
        if (err || req.body.password !== req.body.confirmation) {
            //send error
            return res.redirect('/');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/'); 
        });
    });
};

// Post login
Controller.doLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    //need to send some error message to the client
    if (!user) { return res.redirect('/'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/dash');
    });
  })(req, res, next);
};

Controller.dash = function(req, res) {
    if(!req.isAuthenticated())
        res.redirect('/');
    res.render('k'); //need to change to render with user 
};

// logouts
Controller.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = Controller;