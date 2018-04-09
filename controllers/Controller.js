var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var nodemailer = require('nodemailer');
var crypto = require("crypto");
var Controller = {};

// Restrict access to root page
Controller.home = function(req, res) {
	if(req.user !== undefined){
		User.findOne({'username': req.user.username}, function(err, user){
			if (err) { 	
				return next(err); 
			}
			if(user != null && user.isVerified && req.isAuthenticated()){
				return res.redirect('/dash');
			}
			else{
				return 	res.render('login', {
					succ: req.flash('succ'),
					error: req.flash('error')
				});
			}
		});
	}
	else{
		res.render('login', {
			succ: req.flash('succ'),
			error: req.flash('error')
		});
	}
};

// Post registration
Controller.doRegister = function(req, res) {
	if (req.body.password !== req.body.confirmation) {
		//send error
		req.flash("error", "Sign Up Failed");
		return res.redirect('/');
	}
	User.register(new User({ username : req.body.username}), req.body.password, function(err, user) {
	 // Create a verification token for this user
	if(user === undefined){
		req.flash("error", err.message);
		return res.redirect('/'); 
	}
	user.token = crypto.randomBytes(16).toString('hex');

	// Save the verification token
	user.save(function (err) {
		if (err) { 
			req.flash("error", "err.message");
			return res.redirect('/'); 
		}
			// Send the email
		var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'noreply.uxtra@gmail.com', pass: 'winterseng513'} });
		var mailOptions = { 
			from: 'no-reply@uxtra.com', 
			to: req.body.username, 
			subject: 'Account Verification Token', 
			text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation?token=' + user.token + '\n' };
		transporter.sendMail(mailOptions, function (info, err) {
			if (err) { 
				req.flash("error", err.message);
				return res.redirect('/'); 
			}
				req.flash("succ",'A verification email has been sent to ' +req.body.username+ '.' );
				return res.redirect('/'); 
			});
		});
		//Authenticate the user using local strategy
		passport.authenticate('local')(req, res, function () {
			req.flash("succ", "Sign Up Success");
			res.redirect('/'); 
		});
	});
};

// Post login
Controller.doLogin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { 	
			req.flash("error","Token Verification Failed");
			return res.redirect('/');  
		}
		//check if the email is verified
		User.findOne({ '_id': user._id}, function(err, user){
			//if the user verified his/her email then load the dashboard
			if (user != null && user.isVerified){
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					return res.redirect('/dash');
				});
			}
			//or redirect to home with error message
			else{ 
				if(user != null && !user.isVerified)
					req.flash("error", "Log In Failed: Check your Email");
				else
					req.flash("error","Log In Failed: User not found");
				return res.redirect('/'); 
			}
		});
	})(req, res, next);
};

Controller.dash = function(req, res) {
	if(!req.isAuthenticated())
		res.redirect('/');
	else{
		//get all of the projects and send it to the client
		projs = [];
		var query = {'pdata': { $exists: true}}; 
		User.find(query, function(err, docs){
			docs.forEach(function(entry){
				projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
			});
			if(req.user === undefined){
				return res.redirect('/');
			}	
			res.render('dashboard',{data: projs, user: req.user.username}); 
		});
	}
};

//nees to be removed
Controller.proj = function(req, res){
	if(!req.isAuthenticated()){
		res.redirect('/');
	}
	else{
		//get all of the projects and send it to the client
		projs = [];
		var query = {'username': req.user.username, 'pdata': { $exists: true}}; 
		User.find(query, function(err, docs){
			if (err) { 	
				return next(err); 
			}
			docs.forEach(function(entry){
				projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
			});
			if(req.user === undefined){
				return res.redirect('/');
			}
			res.render('projects', {
				user: req.user.username,
				data: projs,
				error: req.flash('error')
			});
		});
	}
};

//needs to remove
Controller.addProj = function(req, res){
	if(req.user === undefined || !req.isAuthenticated())
		res.redirect('/');
	else{
		res.render('add-project', {user: req.user.username, error: req.flash('error')});
	}
};

//do add project
Controller.doProj =function(req, res){
	if(!req.isAuthenticated())
		res.redirect('/');
	var io = req.app.get('socketio');
	var query = {'username': req.user.username}; 
	User.findOne(query, function (err, doc) {
		//get the project's info and uploaded image save it as a string in db
		if(!err && req.files.file !== undefined){
			var img = new Buffer(req.files.file.data).toString('base64'); 
			img =  "data:" + req.files.file.mimetype + ';base64,' +img;
			img = JSON.stringify(img);
			doc.pdata = img;
			doc.pdes = req.body.des;
			doc.pname = req.body.projname;

			doc.save(function(err){
				if(err){
					console.log("db not updated");
					req.flash("error", "Upload Failed");
					res.redirect('/addproj');
				}
			console.log("update others");
			io.emit('addProj',{proj: req.body.projname, buff: img, des: req.body.des, auth: req.user.username});
			res.redirect('/proj');
			});
		}
		else{
			req.flash("error", "Upload Failed");
			res.redirect('/addproj');
		}
	});
};

//check token
Controller.doConfirmation = function(req, res){
	User.findOne({ 'token': req.query.token}, function (err, user) {
        if (!user){
			req.flash("error", 'We were unable to find a user for this token.');
			return res.redirect('/'); 
		} 
        if (user.isVerified){
			req.flash("error", "Account is already been verified.");
			return res.redirect('/'); 
		} 
            // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
			if (err) { 
				req.flash("error", "err.message");
				return res.redirect('/'); 
			}
			req.flash("succ", "Account has been verified, Please log in.");
			res.render('login', {
				succ: req.flash('succ'),
				error: req.flash('error')
			});
        });
    });
};

// logouts
Controller.logout = function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
};

module.exports = Controller;