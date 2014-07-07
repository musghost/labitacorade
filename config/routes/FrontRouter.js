var express = require('express'),
	router = express.Router(),
	frontController = require('../../app/controllers/FrontController.js');

router.get('/', frontController.index);

module.exports = router;