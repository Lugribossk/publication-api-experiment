/*global window, require*/
// RequireJS main file to start Testacular test runs.
(function () {
    "use strict";

    require.config({
        // Testacular serves files from /base, so the baseUrl is that with the path to the RequireJS root appended.
        baseUrl: "/base/src/main/javascript",
        paths: {
            // Use a local copy of jQuery so we don't need an internet connection to run unit tests.
            jquery: "lib/jquery-1.8.2"
        }
    });

    // Testacular has a list of all the files it serves, process those so we can require all the tests (i.e. files that end with "Test.js").
    var allTests = Object.keys(window.__testacular__.files).filter(function (file) {
        return (/Test\.js$/).test(file);
    });

    require(allTests, function () {
        window.__testacular__.start();
    });
}());