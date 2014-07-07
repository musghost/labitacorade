var User = require('../models').User,
	passport = require('passport'),
	jwt = require('jwt-simple'),
	moment = require('moment'),
	jwtTokenSecret = 'hYhd%yd=H(.Gfd',
	mail = require('nodemailer').mail,
	jade = require('jade'),
	path = require('path');

module.exports = {
	login: function(req, res, next){
		if(req.user){
			res.redirect('/');
		} else{
			res.render('login/index', { message: req.session.messages });
			req.session.messages = null;
		}
	},
	signup: function(req, res, next){
		res.render('login/signup');
	},
	session: function(req, res, next){
		User.findUser(req.param('username', 'password', function(users){
			console.log(users)
			res.send('myusers');
		}));
	},
	loginPost: function(req, res, next){
		var errors;
		// Verify if fields are empty
		req.checkBody('username', 'El usuario es obligarotio.').notEmpty();
		req.checkBody('password', 'El password es obligarotio.').notEmpty();
		// Store error object if exist errors in validation if not then error is equal to null
		errors = req.validationErrors();
		// Display errors in login template
		if (errors) { 						
		 	return res.render('login/index', { errors : errors});;
		};
		// Sanitize inputs before looking in the database if there wasn't errors
		req.sanitize('username').escape();	
		req.sanitize('password').escape();		
		// Search user into database
		passport.authenticate('local-login', function(err, user, info){	
			if( (err) || (!user)){
				return res.render('login/index', { errors: [{ msg: 'El nombre o la contraseña son incorrectos' }] });
			}
			req.logIn(user, function(err){
	               if (err){
	                console.log("loginPost:" + err);
					res.redirect('/login');
					return;
				}
				res.redirect('/dashboard');
				return;
			});
		})(req, res, next);
	},
	logout: function(req, res, next){
		req.logout();
		res.redirect('/');
	},
	signupPost: function(req, res, next){
		var errors,
			emptyFields = ['username', 'name'],
			sanitizeFields = ['username', 'name', 'password', 'passwordconfirm'];
		// Validations for each input			
		for (var i = emptyFields.length - 1; i >= 0; i--) {
			req.checkBody(emptyFields[i], 'El campo '+emptyFields[i]+' es obligatorio').notEmpty();
		};
		req.checkBody('email', 'Proporcione un correo valido.').isEmail();
		req.checkBody('password', 'Los password no son iguales.').equals(req.body.passwordconfirm);
		// Store error object if exist errors in validation if not then error is equal to null
		errors = req.validationErrors();
		// Display errors in signup template
		if (errors) { 						
			return res.render('login/signup', { errors : errors });
		};
		// Sanitize inputs before store in the database if there wasn't errors
		for (var i = sanitizeFields.length - 1; i >= 0; i--) {
			req.sanitize(sanitizeFields[i]).escape();
		};
		// Create new user and redirect to dashboard
		passport.authenticate('local-signup', function(err, user, info){
			if(err || (!user)){			
				return res.render('login/signup', { errors: [{ msg: 'Ya existe un nombre de usuario con ese nombre' }] });
			}; 
			req.logIn(user, function(err){
                if (err){
                	console.log("loginPost:" + err);
					res.redirect('/login');
					return;
				}
				var expires = moment().add('hours', 10).valueOf(),
					token = jwt.encode({
						iss: user.id,
						exp: expires
					}, jwtTokenSecret),
					template = jade.renderFile( path.resolve(__dirname, '../views/mail') + '/signup.jade', {name: user.name, token: token });


				mail({
				    from: "User <user@localhost>",
				    to: user.email,
				    subject: "Hello ✔",
				    text: "Hello world ✔",
				    html: template
				});
				console.log("token:" + token);


				res.redirect('/dashboard');
				return;
			});
		})(req, res, next);		
	},
	confirm: function(req, res, next){
		var token = req.query.u;
		if(token){
			try{
				var decoded = jwt.decode(token, jwtTokenSecret);
				if(decoded.exp <= Date.now() ){
					res.render('login/confirm', {message: 'El enlace ya no es válido :('});
				} else {
					User.find(decoded.iss).success(function(user){
						user.status = 1;
						user.save().success(function(err){
							res.render('login/confirm', {message: 'Bienvenido. Vuelve a iniciar sesión'});
						});
					}).error(function(err){
						console.log(err);
					});
				}

			} catch(err){
				res.render('login/confirm', {message: 'El enlace no existe'});
				console.log(err);
			}
		} else{
			console.log('There\'s no token');
			res.render('login/confirm', {message: 'El enlace no existe'});
		}
	},
	dashboard: function(req, res, next){
		res.render('dashboard/index');
	}
}