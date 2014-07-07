'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
      less: {
        development: {
          options: {
            compress: true
          },
          files: {
            "public/assets/css/login.css": "css-sources/login.less",
            "public/assets/css/home.css": "css-sources/home.less",
            "public/assets/css/dashboard.css": "css-sources/dashboard.less"
          }
        }
    },
    bower: {
      install: {
        options: {
          targetDir: './public/assets',
          layout: 'byType',
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: true,
          bowerOptions: {}
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      css: {
        files: ['public/styles/*.css'],
        options: {
          livereload: reloadPort
        }
      },
      jade: {
        files: ['app/views/**/*.jade'],
        options: { livereload: reloadPort, pretty: true }
      },
      less: {
          files:['public/assets/css/**/*.less', 'public/css/**/*.less', 'css-sources/**/*.less'],
          tasks: ['less']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'app.js',
        'app/**/*.js',
        'config/**/*.js'
      ]
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['develop', 'watch']);
  grunt.registerTask('hint', ['jshint']);
};
