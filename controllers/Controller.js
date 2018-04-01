var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var Controller = {};

// Restrict access to root page
Controller.home = function(req, res) {   
//    res.render('test', {data: JSON.stringify("hey")});
	res.render('login', {succ: req.flash('succ'),
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
	projs = [];
	var query = {'pdata': { $exists: true}}; 
	User.find(query, function(err, docs){
		docs.forEach(function(entry){
			var img = new Buffer(entry.pdata).toString('base64'); 
			img =  "data:" + entry.pctype + ';base64,' +img;
			img = JSON.stringify(img);
			projs.push({proj: entry.pname, buff: img, des: entry.pdes, auth: entry.username});
		});
		res.render('dashboard', {data: projs, 
			succ: req.flash('succ'),
			error: req.flash('error')	
		}); //need to change to render with user 
	});
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
		doc.pdata = req.files.file.data; //img buffer
		doc.pdes = req.body.des;
		doc.pname = req.body.projname;
		doc.pctype = req.files.file.mimetype; //content type 
		doc.save(function(err){
			if(err){
				console.log("db not updated");
				req.flash("error", "Upload Error");
				res.redirect('/dash');
			}		
		});
	if(err)
		req.flash("error", "Upload Failed");
	else
		req.flash("succ", "Upload Success");
	res.redirect('/dash');
	});
};

// logouts
Controller.logout = function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
};

module.exports = Controller;