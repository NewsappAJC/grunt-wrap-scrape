/*
 * grunt-wrap-scrape
 * https://github.com/statesman/grunt-wrap-scrape
 *
 * Copyright (c) 2015 Andrew Chavez
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    scrapehtml: {
      options: {
        els: [
          '#scrape-this',
          '#and-this'
        ],
        url: 'http://localhost:8080/html.html'
      },
      defaults: {
        dest: 'tmp/scrape-html-defaults.js'
      }
    },

    scrapecss: {
      options: {
        url: 'http://localhost:8080/css.html',
        els: 'style'
      },
      wrap: {
        dest: 'tmp/scrape-css-defaults.css'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-http-server');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'scrapehtml', 'scrapecss', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
