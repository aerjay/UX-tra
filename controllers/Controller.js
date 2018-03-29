var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var Controller = {};

// Restrict access to root page
Controller.home = function(req, res) {   
//    res.render('test', {data: JSON.stringify("hey")});
	res.render('index', {succ: req.flash('succ'),
	error: req.flash('error')
});
};

// Post registration
Controller.doRegister = function(req, res) {
	User.register(new User({ username : req.body.username}), req.body.password, function(err, user) {
		if (err || req.body.password !== req.body.confirmation) {
			//send error
			req.flash("error", "Sign Up Failed");
			return res.redirect('/');
		}
		passport.authenticate('local')(req, res, function () {
		//	req.flash("messages", {"success": "Sign Up Success"});
			req.flash("succ", "Sign Up Success");
			res.redirect('/'); 
		});
	});
};

// Post login
Controller.doLogin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		//need to send some error message to the client
		if (!user) { 
			req.flash("error", "Log In Failed");
			return res.redirect('/'); 
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/dash');
		});
	})(req, res, next);
};

Controller.dash = function(req, res) {
	if(!req.isAuthenticated())
		res.redirect('/');
	res.render('dashboard',{
		succ: req.flash('succ'),
		error: req.flash('error')
	});
	/*
	var query = {'pdata': { $exists: true}}; 
	User.find(query, function(err, docs){
		docs.forEach(function(entry){
		});
		res.render('dashboard', {data: 'd'}); //need to change to render with user 

	});
	*/
};

Controller.proj = function(req, res){
	if(!req.isAuthenticated())
		res.redirect('/');
	res.render('add-project');
};

Controller.doProj =function(req, res){
	if(!req.isAuthenticated())
		res.redirect('/');
	var query = {'username': req.user.username}; 
	User.findOne(query, function (err, doc) {
		console.log(doc.pdata);
		doc.pdata = req.files.file.data;
		doc.pdes = req.body.des;
		doc.pname = req.body.projname;
		doc.save(function(err){
			if(err){
				console.log("db not updated");
				req.flash("error", "Upload Error");
				res.redirect('/dash');
			}		
		});
	req.flash("succ", "Upload Success");
	res.redirect('/dash');
	});
};

// logouts
Controller.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

module.exports = Controller;