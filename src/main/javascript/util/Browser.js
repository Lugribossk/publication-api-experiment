/*global window*/
define([],
    function () {
        "use strict";

        /**
         * Utility class for getting the window object.
         * This makes unit testing easier and avoids having to add it as an allowed global variable.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function Browser() {}

        /**
         * Get the window object.
         *
         * @return {Window}
         */
        Browser.getWindow = function () {
            return window;
        };

        return Browser;
    });