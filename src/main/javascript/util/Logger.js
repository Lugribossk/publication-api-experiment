/*global console*/
define(["jquery"],
    function ($) {
        "use strict";

        /**
         * @constructor
         *
         * @param {String} name
         */
        function Logger(name) {
            this.name = name;
        }

        function blah(scope, args) {
            return ["[" + scope.name + "]"].concat($.makeArray(args));
        }

        Logger.prototype.info = function () {
            console.info.apply(console, blah(this, arguments));
        };

        Logger.prototype.warn = function () {
            console.warn.apply(console, blah(this, arguments));
        };

        Logger.prototype.error = function () {
            console.error.apply(console, blah(this, arguments));
        };

        Logger.prototype.assert = function (condition) {
            if (!condition) {
                this.error.apply(this, $.makeArray(arguments).slice(1));
                debugger;
            }
        };

        return Logger;
    });