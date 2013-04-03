// Almond code wrapper, modified from https://github.com/jrburke/almond#exporting-a-public-api
(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        root.PublicationAPI = factory();
    }
}(this, function () {
