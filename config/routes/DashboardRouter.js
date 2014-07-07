var express = require('express'),
	router = express.Router(),
	dashboardController = require('../../app/controllers/DashboardController.js');

router.get('/', dashboardController.index);

module.exports = router;