// Karma configuration
// Generated on Thu Jun 09 2016 11:42:09 GMT+0200 (Paris, Madrid (heure d’été))

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // 'bower_components/angular/angular.js',
            // 'bower_components/angular-mocks/angular-mocks.js',
            // 'bower_components/x2js/xml2json.js',
            // 'bower_components/angular-xml/angular-xml.js',
            // 'bower_components/angular-animate/angular-animate.js',
            // 'bower_components/angular-cookies/angular-cookies.js',
            // 'bower_components/angular-resource/angular-resource.js',
            // 'bower_components/angular-route/angular-route.js',
            // 'bower_components/angular-sanitize/angular-sanitize.js',
            // 'bower_components/angular-touch/angular-touch.js',
            // 'app/scripts/**/*.js',
            // 'libs/**/*.js',
            'app/scripts/shortestpath2.js',
            'test/spec/shortestpath.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 8080,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
