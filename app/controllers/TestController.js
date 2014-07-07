var models = require('../models');
	User = models.User,
	bcrypt = require('bcrypt-nodejs');

module.exports = {
	myTest: function(req, res, next){
		/*User.bulkCreate([{
			user_name: 'randomname',
            email: 'random@mail.com',
			pass: bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
			name: 'Unreal name',
			status: 0
		},{
			user_name: 'randomname2',
            email: 'random@mail.com',
			pass: bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
			name: 'Unreal name 2',
			status: 0
		},{
			user_name: 'randomname3',
            email: 'random@mail.com',
			pass: bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
			name: 'Unreal name 3',
			status: 0
		},{
			user_name: 'randomname4',
            email: 'random@mail.com',
			pass: bcrypt.hashSync('1234', bcrypt.genSaltSync(8), null),
			name: 'Unreal name 4',
			status: 0
		}]).success(function(NewUser){
			res.send(JSON.stringify(NewUser))
		});*/

		if(typeof req.user === 'undefined'){
			console.log('No session');
			res.send('no session');
		} else{
			User.find(req.user.dataValues.id).success(function(user){
				user.setFriends([2,3]).success(function(){
					console.log('Done');
					res.send('Done');
				}).error(function(err){
					console.log(err);
					res.send(err);
				});
			});
		}
	}
};