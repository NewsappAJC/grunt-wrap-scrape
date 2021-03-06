/*
 * grunt-wrap-scrape
 * https://github.com/statesman/grunt-wrap-scrape
 *
 * Copyright (c) 2015 Austin American-Statesman
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio'),
    request = require('sync-request');

module.exports = function(grunt) {

  // Register the task
  var taskDesc = 'Scrape CSS elements from a Web page and save them to a file.';

  grunt.registerMultiTask('scrapecss', taskDesc, function() {

    // Set defaults
    var options = this.options({
      url: false,
      filterContent: function(style) {
        return true;
      }
    });

    // Validate options
    if(!options.url || grunt.util.kindOf(options.url) !== 'string') {
      grunt.fail.fatal('A URL for the page to scrape is required. Set it as options.url.');
    }
    else if(grunt.util.kindOf(options.els) !== 'string') {
      grunt.fail.fatal('options.els must be a string.');
    }
    else if(grunt.util.kindOf(options.filterContent) !== 'function') {
      grunt.fail.fatal('options.filterContent must be a function.');
    }

    // Get the page to scrape
    var toScrape = request('GET', options.url);

    // Get the body and parse it using cheerio
    var $ = cheerio.load(toScrape.getBody('utf8'));

    // Get the contents of each <style> tag
    var styles = $('style').map(function(i, el) {
      return $(el).text();
    }).get();

    // Filter out empty items
    var filtered = styles.filter(function(style) {
      return style.length > 0;
    });

    // Fail if none of the specified items are found
    if(filtered.length === 0) {
      grunt.fail.warn('No elements matching options.els found on the page. No output file will be created.');
    }

    // Run the our filter function
    var afterFilter = filtered.filter(options.filterContent);

    // Fail if none of the specified items are found
    if(afterFilter.length === 0) {
      grunt.fail.warn('No styles remain after filtering using options.filterContent. No output file will be created.');
    }

    // Count the number of found elements (for reporting in the console)
    var numEls = afterFilter.length;

    // Join the array of CSS styles into a single string
    var joined = afterFilter.join('\n');

    // Save our scraped CSS
    this.files.forEach(function(file) {
      grunt.file.write(file.dest, joined);
      grunt.log.oklns('Saved ' + numEls + ' scraped CSS elements to "' + file.dest + '".');
    });

  });

};
