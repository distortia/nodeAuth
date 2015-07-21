var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//pull in user model
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next){
	res.render('register',{
		title: 'Register'
	});
});
router.get('/login', function(req, res, next){
	res.render('login',{
		title: 'Log In'
	});
});

router.post('/register', function(req, res, next){
	//Get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//Get image
	if(req.body.profileImage){
		console.log('Uploading Image');

		var profileImageOriginalName = req.files.profileImage.originalName;
		var profileImageName = req.files.profileImage.name;
		var profileImageMime = req.files.profileImage.mimetype;
		var profileImagePath = req.files.profileImage.path;
		var profileImageExt = req.files.profileImage.extension;
		var profileImageSize = req.files.profileImage.size;
	} else {
		var profileImageName = 'noimage.png'
	}

	//form validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'This is a not a valid email').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//Send errors
	var errors = req.validationErrors();
	if(errors){
		//This renders the view and keeps all the values the user entered
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		} );
	} else {
		//Make a user object
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileImage: profileImageName
		});


		//Create user
		User.createUser(newUser, function(error, user){
			if(error){
				throw error;
			}
			console.log(user);
			req.flash('success', 'You have successfully registered. Please log in.');
			res.location('/');
			res.redirect('/');
		});
	}
});
//for session handling
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.findUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				return done(null, false,{message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message:'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});

module.exports = router;
