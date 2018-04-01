var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var nodemailer = require('nodemailer');

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
		if (req.body.password !== req.body.confirmation) {
			//send error
			req.flash("error", "Sign Up Failed");
			return res.redirect('/');
		}
		User.register(new User({ username : req.body.username}), req.body.password, function(err, user) {
		 // Create a verification token for this user
		user.token = crypto.randomBytes(16).toString('hex');

		// Save the verification token
		user.save(function (err) {
			if (err) { 
				console.log("2");
				req.flash("error", "err.message");
				return res.redirect('/'); 
			}
 
			// Send the email
			console.log(req.body.username);
			var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'noreply.uxtra@gmail.com', pass: 'winterseng513'} });
			var mailOptions = { 
			from: 'no-reply@uxtra.com', 
			to: req.body.username, 
			subject: 'Account Verification Token', 
			text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation?token=' + user.token + '.\n' };
			transporter.sendMail(mailOptions, function (info, err) {
			if (err) { 
				req.flash("error", "err.message");
				return res.redirect('/'); 
			}
				console.log(info);
				req.flash("succ",'A verification email has been sent to ' +req.body.username+ '.' );
				return res.redirect('/'); 
			});
		});

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
		if (err) { 	
			return next(err); 
		}
		//check if the email is verified
		console.log("do login");
		console.log(req._id);
		User.findOne({ '_id': user._id}, function(err, user){
			if (user != null && user.isVerified){
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					return res.redirect('/dash');
				});
			}
			else{ 
				if(!user.isVerified)
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
	projs = [];
	var query = {'pdata': { $exists: true}}; 
	User.find(query, function(err, docs){
		docs.forEach(function(entry){
			projs.push({proj: entry.pname, buff: entry.pdata, des: entry.pdes, auth: entry.username});
		});
		res.render('dashboard', {data: projs, 
			succ: req.flash('succ'),
			error: req.flash('error')	
		}); 
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
		if(err){
			req.flash("error", "Upload Failed");
			res.redirect('/dash');
		}
		console.log(req.files);
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
				res.redirect('/dash');
			}
		res.redirect('/dash');
		});
	});
};

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
				res.redirect('/'); 
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