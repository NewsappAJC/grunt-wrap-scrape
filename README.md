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
      dest: 'markup.js'
    }
  }
});
```

## The "scrapecss" task

### Overview
In your project's Gruntfile, add a section named `scrapecss` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scrapecss: {
    options: {
      // URL to scrape
      url: 'http://example.com/path/to/wrap'

      // Optional: Selector(s) for the elements to scrape.
      els: 'style',

      // Optional: Filter the scripts included in the final file using a filter
      // function, which will be passed each style, and return a boolean
      // indicating whether the style should be kept
      filterContent: function(style) {
        // Example of excluding all styles containing string `.header a`
        return style.indexOf('.header a') === -1;
      }
    },
    your_target: {
      options: {
        // Target-specific options go here
      },

      dest: 'scraped-css.css'
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
Type: `String` `Array`
Default: `style`

TK

#### options.filterContent
Type: `Function`
Default:
```js
function(script) {
  return true
}
```

### Usage Examples

#### Scraping inline styles from the Medley wrap
In this example, we're scraping a Medley wrap endpoint, finding inline styles and saving them to a local CSS file.

```js
grunt.initConfig({
  scrapecss: {
    options: {
      url: 'http://www.mystatesman.com/api/wraps/v1/wrap/1487/?format=html',
      els: 'style'
    },
    wrap_styles: {
      dest: 'wrap-styles.css'
    }
  }
});
```

## The "scrapejs" task

### Overview
In your project's Gruntfile, add a section named `scrapejs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scrapejs: {
    options: {
      // URL to scrape
      url: 'http://example.com/path/to/wrap'

      // Optional: A blacklist of sources to exclude from scraping
      srcBlacklist: [
        'jquery.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js'
      ],

      // Optional: A blacklist of strings that, if found in script content,
      // will cause a script to be excluded
      contentBlacklist: [
        // Example of excluding the Google Tag manager
        'var googletag = googletag || {},'
      ],

      // Optional: A filter function that can be used to filter scripts based
      // on content; return true to include a script or false to exclude
      filterContent: function(script) {
        // Example of filtering out everything but the Google Tag Manager
        return script.indexOf('var googletag = googletag || {},') !== -1;
      }
    },
    your_target: {
      options: {
        // Target-specific options go here
      },

      dest: 'scraped-js.js'
    },
  },
});
```

### Options

#### options.url
**Required**
Type: `String`

TK

#### options.srcBlacklist
Type: `Array`
Default: `[]`

TK

#### options.contentBlacklist
Type: `Array`
Default: `[]`

TK

#### options.filterContent
Type: `Function`
Default:
```js
function(script) {
  return true
}
```

TK

### Usage Examples

#### Scraping inline styles from the Medley wrap
In this example, we're scraping the JavaScript from a Medley wrap endpoint, and saving them to a single concatenated local JavaScript file. The files in `options.srcBlacklist` (some Bootstrap plug-ins and other unneeded items) will be excluded, as will the Google Tag Manager (see `options.contentBlacklist`).

The two targets - `access-meter` and `wrap` - are distinct in that one contains the actual access meter code and the everything contains everything but the access meter code. That filtering is handled by each tasks `filterContent` function, which looks for the access meter's function signature.

```js
grunt.initConfig({
  scrapejs: {
    options: {
      srcBlacklist: [
        'common/premium/js/bootstrap-transition.js',
        'common/premium/js/bootstrap-modalmanager.js',
        'common/premium/js/bootstrap-modal-ext.js',
        'common/premium/js/bootstrap-dropdown.js',
        'common/premium/js/bootstrap-collapse.js',
        'www.googletagservices.com/tag/js/gpt.js',
        'common/premium/js/cmg-header.js',
        'common/premium/js/jquery.placeholder.min.js',
        'common/lib/lazythumbs/js/lazythumbs.js',
      ],
      contentBlacklist: [
        'var googletag = googletag || {},'
      ],
      url: "<%= wrapUrl %>"
    },
    'access-meter': {
      options: {
        filterContent: function(script) {
          return script.indexOf('(function (cmg, $, janrain, plate) {') !== -1;
        }
      },
      dest: 'build/access-meter.js'
    },
    wrap: {
      options: {
        filterContent: function(script) {
          return script.indexOf('(function (cmg, $, janrain, plate) {') === -1;
        }
      },
      dest: 'build/wrap.js'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
