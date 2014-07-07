var express = require('express'),
	isLoggedIn = function(req, res, next){
		if(req.isAuthenticated())
			return next();
		res.redirect('/login');
	}

module.exports = function(app, passport){

	//home route
	var router = express.Router(),
		userRouter = require('./routes/UserRouter'),
		frontRouter = require('./routes/FrontRouter')
		test = require('./routes/TestRouter'),
		dashboardRouter = require('./routes/DashboardRouter');

	app.use('/', frontRouter);
	app.use('/user', userRouter);
	app.use('/dashboard', dashboardRouter);

	app.use(function(serverErr, err, req, res,next){
		if (serverErr.status == 500){
			res.render('500', err);
		}
	});

};