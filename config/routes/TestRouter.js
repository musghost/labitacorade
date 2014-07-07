var express = require('express'),
	router = express.Router(),
	testController = require('../../app/controllers/TestController.js');

router.get('/', testController.myTest);

module.exports = router;