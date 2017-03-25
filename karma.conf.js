'use strict';

// Customize browser testing defining an environment variable as:
// export BROWSERS="Chrome Firefox PhantomJS"
function parseBrowsers(browsers) {
    if (process.env.PRECOMMIT) {
        return ['PhantomJS'];
    } else if (process.env.BROWSERS) {
        return process.env.BROWSERS.split(" ")
    }

    return browsers;
}

module.exports = function(config) {

  var configuration = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch : false,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'jasmine',
      'jasmine-matchers'
    ],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/lodash/lodash.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-gridster/src/angular-gridster.js',
      'bower_components/angular-block-ui/dist/angular-block-ui.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-hotkeys/src/hotkeys.js',
      'bower_components/angular-extended-notifications/angular-extended-notifications.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ngEmbed/src/ng-embed.js',
      'bower_components/angular-audio/app/angular.audio.js',
      'bower_components/mousetrap/mousetrap.js',
      'src/app/*.js',
      'src/app/*/**/*.js',
      'tests/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'gulpAngular'
    },

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-jasmine-matchers',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
      'karma-mocha-reporter'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src/app/**/*.js': ['coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // optionally, configure the reporter
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: parseBrowsers(['Firefox', 'Chrome', 'PhantomJS']),


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1

  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
