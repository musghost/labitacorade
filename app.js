var express = require('express'),
  orm = require('orm'),
  fs = require('fs'),
  config = require('./config/config'),
  passport = require('passport'),
  db = require('./app/models');

orm.db = orm.connect(config.db, function(err, db){
  if(err){
    console.log("Something is wrong with the connection", err);
    return ;
  }
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/passport')(passport);
require('./config/express')(app, config);
require('./config/routes')(app, passport);

db.sequelize
  .sync({
    syncOnAssociation: false,
    charset: 'utf8',
    freezeTableName: true
    //force: true
  })
  .complete(function(err) {
    if (err) {
      throw err
    } else {
      app.listen(config.port);
      console.log("Running application at: http://localhost:" + config.port);
    }
  });
