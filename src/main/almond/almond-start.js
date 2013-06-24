(function (root, factory) {
    "use strict";

    // Almond code wrapper, modified from https://github.com/jrburke/almond#exporting-a-public-api
    // This fragment is placed before all the combined module code (including Almond), with almond-end placed after it.
    // The result is that all the project code is wrapped in the factory function that starts below, which is then passed
    // as an argument to this function.
    // That completely encapsulates require and define used in the factory function (since it is defined in there by
    // Almond in the beginning), so that it does not interfere with how the rest of the page behaves.
    // The define used here is the one defined by the page this script is running inside.

    if (typeof define === "function" && define.amd) {
        if (typeof process !== "undefined" && process.versions && !!process.versions.node) {
            // Running in NodeJS, so depend on the NodeJS module that makes NodeJS and RequireJS work together.
            define(["requirejs"], factory);
        } else {
            // Running in a RequireJS project in a browser, so depend on jQuery.
            define(["jquery"], factory);
        }
    } else {
        // Running as a standalone library, so define as global.
        root.PublicationAPI = factory(null);
    }
}(this, function (jQueryOrNodeRequire) {
