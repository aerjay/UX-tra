let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let schema = new Schema({
    fullname: String,
    title:String,
    username:String,
    password: String,
    project: {data: Buffer, header: String}
});

schema.plugin(passportLocalMongoose);

module.exports = mongoose.model('db',schema);