var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'labitacora'
    },
    port: 3000,
    db: 'mysql://root:@localhost/labitacora'
  },

  test: {
    root: rootPath,
    app: {
      name: 'labitacora'
    },
    port: 3000,
    db: 'mysql://root:@localhost/labitacora'
  },

  production: {
    root: rootPath,
    app: {
      name: 'labitacora'
    },
    port: 3000,
    db: 'mysql://root:@localhost/labitacora'
  }
};

module.exports = config[env];
