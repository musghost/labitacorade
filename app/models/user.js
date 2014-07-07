var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING
    },
    birthday: {
      type: DataTypes.DATE
    },
    gender: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.INTEGER
    }
  },
  {
    classMethods: {
      findUser: function(user_name, pass, callback){
        this.findAll({
          where: {
            user_name: user_name,
            pass: pass
          }
        }).success(callback);
      },
      newUser: function(req, user, password, done){
        var _this = this;
        this.findAndCountAll({
          where: {
            user_name: user
          }
        }).success(function(result){
          if(result.count > 0)
            return done(null, false);
          else{
            _this.create({
              user_name: user,
              email: req.body.email,
              pass: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
              name: req.body.name,
              status: 0
            }).success(function(NewUser){
              return done(null, NewUser);
            });
          }
        });
      }
    },
    instanceMethods: {
      validPassword: function(password){
        return bcrypt.compareSync(password, this.pass);
      },
      createUsers: function(){

      }
    },
    associate: function(models) {
      User.hasMany(models.User, {
        as: 'Friends',
        through: 'Friendship',
        foreignKeyConstraint: true,
        onUpdate: 'restrict'
      });
    }
  });

  return User;
}
