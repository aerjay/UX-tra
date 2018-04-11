// this code was provided by 
// https://www.djamware.com/post/58bd823080aca7585c808ebf/nodejs-expressjs-mongoosejs-and-passportjs-authentication
// to create models for the authentication requirement. 
// This specificically is defining a User model.

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let schema = new Schema({
	fullname: String,
	title: String,
	username: String,
	password: String,
	pname: String, 
	pdata: String,
	pdes: String,
	pvote: Number,
	isVerified: { type: Boolean, default: false },
	token: { type: String }
});

var options = {
	errorMessages: {
		MissingPasswordError: 'No password was given',
		AttemptTooSoonError: 'Account is currently locked. Try again later',
		TooManyAttemptsError: 'Account locked due to too many failed login attempts',
		NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
		IncorrectPasswordError: 'Password or username are incorrect',
		IncorrectUsernameError: 'Password or username are incorrect',
		MissingUsernameError: 'No username was given',
		UserExistsError: 'A user with the given username is already registered'
	}
};

schema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', schema);
