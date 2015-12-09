# grunt-wrap-scrape

> Tools to scrape a wrap from CMG's Medley CMS.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git+https://github.com/statesman/grunt-wrap-scrape.git
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-wrap-scrape');
```

## The "scrapehtml" task

### Overview
In your project's Gruntfile, add a section named `scrapehtml` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scrapehtml: {
    options: {
      // URL to scrape
      url: 'http://example.com/path/to/wrap'

      // Selectors for the elements to scrape.
      els: [
        '#some-id',
        '.a-class'
      ],

      // Optional: Process the HTML before it's wrapped in JS
      processHtml: function(markup) {
        markup.push('<h1>Adding some custom HTML</h1>');
        return markup;
      },

      // Optional: Override how the HTML is turned into JS
      makeJs: function(markup) {
        // Example of using jQuery instead of default, which is document.write
        return '$("body").append("' + markup + '");';
      }
    },
    your_target: {
      options: {
        // Target-specific options go here
      },

      dest: 'scraped-html.js'
    },
  },
});
```

### Options

#### options.url
**Required**
Type: `String`

TK

#### options.els
**Required**
Type: `Array`

TK

#### options.processHtml
Type: `Function`
Default value:
```js
function(markup) {
  return markup;
}
```

TK


#### options.makeJs
Type: `Function`
Default value:
```js
function(markup) {
  return "document.write('" + markup + "');";
}
```

TK

### Usage Examples

#### Scraping a Medley wrap
In this example, we're scraping a Medley wrap endpoint, processing the HTML to wrap it in a custom `<div>` and inserting it on the page using CMG's namespaced jQuery.

```js
grunt.initConfig({
  wrap_scrape: {
    scrapehtml: {
      options: {
        url: 'http://www.mystatesman.com/api/wraps/v1/wrap/1487/?format=html',
        els: [
          //Janraid markup
          '#returnSocial',
          '#returnTraditional',
          '#socialRegistration',
          '#traditionalRegistration',
          '#traditionalRegistrationBlank',
          '#registrationSuccess',
          '#registrationSuccessConfirmed',
          '#forgotPassword',
          '#forgotPasswordSuccess',
          '#mergeAccounts',
          '#traditionalAuthenticateMerge',
          '#resendVerification',
          '#resendVerificationSuccess',
          '#pq-passage-quota-block',
          '#pq-passage-quota-sticky',
          '#pq-passage-quota-welcome',
          // Not in the CMG docs, but required
          '#signIn'
        ],
        processHtml: function(markup) {
          markup.unshift('<!-- Begin CMG wrap -->\n<div id="#cmg-wrap-aas">');
          markup.push('</div>\n<!-- End CMG wrap -->');
          return markup;
        },
        makeJs: function(markup) {
          return 'cmg.query.holdReady(true);' +
            'cmg.query("body").append(\'' +
            markup +
            '\');' +
            'cmg.query.holdReady(false);';
        }
      },
      markup: {
        dest: 'build/markup.js'
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
