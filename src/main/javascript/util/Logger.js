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
            this._name = name;
        }

        function blah(scope, args) {
            return ["[" + scope._name + "]"].concat($.makeArray(args));
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
                // This debugger statement is allowed to stay in as it's part of the assert functionality.
                /*jslint debug:true*/
                debugger;
            }
        };

        return Logger;
    });