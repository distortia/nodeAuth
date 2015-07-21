var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/nodeAuth');
var db = mongoose.connection;

//User Schema
var userSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		bcrypt: true,
		required: true
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileImage: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.comparePassword = function(password, hash, callback){
	bcrypt.compare(password, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.findUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.findUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		//set hashed password
		newUser.password = hash;
		//create user
		newUser.save(callback);
	});
}