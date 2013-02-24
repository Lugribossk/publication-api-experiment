// Testacular configuration

// base path, that will be used to resolve files and exclude
basePath = "";


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    REQUIRE,
    REQUIRE_ADAPTER,
    // Seems like this file must be first or the test run will silently do nothing.
    "src/test/javascript/test-main.js",
    // Serve all code and tests, but do not include and execute it in the served html page.
    {pattern: "src/main/javascript/**/*.js", included: false},
    {pattern: "src/test/javascript/**/*.js", included: false}
];

preprocessors = {
    // Exclude files in the lib folder from code coverage calculations.
    "**/src/main/javascript/!(lib)**/*.js": "coverage"
};

// list of files to exclude
exclude = [];


// test results reporter to use
// possible values: "dots", "progress", "junit"
reporters = ["progress", "junit", "coverage"];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ["Chrome"];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 20000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;


coverageReporter = {
    type : "html", // "cobertura"
    dir : "target/coverage/"
};
