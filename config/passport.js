var LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt-nodejs'),
	User = require('../app/models').User,
	_ = require('underscore');
	
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		
		User.find(id).success(function(user){
			done(null, user);
		});
		
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, 
		function(req, username, password, done) {			
			process.nextTick(function(){
				User.newUser(req, username, password, done);				
			});
		}
	));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, 
		function(username, password, done) {
			User.find({
				where: {
					user_name: username
				}
			}).success(function(user){
				if(!_.isNull(user)){
					if (bcrypt.compareSync(password, user.pass)) { // Compare passwords
						return done(null, user);
					} else {
						return done(err);
					}
				} else{
					var err = {
						message: 'No existe el usurio'
					}
					return done(err);
				}
			}).error(function(err){
				return done(err);
			});
		}
	));

};
