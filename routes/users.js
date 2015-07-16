var express = require('express');
var router = express.Router();

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
	}

	//Create user
	user.createUser(newUser, function(error, user){
		if(error){
			throw error;
			console.log(user);
		}

		req.flash('success', 'You have successfully registered. Please log in.');
		res.location('/');
		res.redirect('/');
	});
});


module.exports = router;
