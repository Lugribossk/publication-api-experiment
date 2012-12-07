/*global window*/
define([],
    function () {
        "use strict";
        // Utility module that just returns window.
        // This makes unit testing easier and avoids having to add it as an allowed global variable.
        return window;
    });