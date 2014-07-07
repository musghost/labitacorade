var express = require('express'),
	router = express.Router(),
	userController = require('../../app/controllers/UserController.js');

router.get('/login', userController.login);

module.exports = router;