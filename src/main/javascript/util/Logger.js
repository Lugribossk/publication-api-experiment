/*global console*/
define(["jquery"],
    function ($) {
        "use strict";

        var output;

        // Create a dummy console for IE.
        if (console !== undefined) {
            output = console;
        } else {
            output = {
                info: function () {},
                warn: function () {},
                error: function () {}
            };
        }

        /**
         * A simple instantiable logger.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {String} name The logger name.
         */
        function Logger(name) {
            this._name = name;
        }

        /**
         * Compose the message to log.
         *
         * @param {Logger} scope
         * @param {Array} args
         * @return {Array}
         */
        function message(scope, args) {
            return ["[" + scope._name + "]"].concat($.makeArray(args));
        }

        /**
         * Log informational message.
         */
        Logger.prototype.info = function () {
            // Chrome requires the console as it's own context.
            output.info.apply(output, message(this, arguments));
        };

        /**
         * Log warning about undesired behavior.
         */
        Logger.prototype.warn = function () {
            output.warn.apply(output, message(this, arguments));
        };

        /**
         * Log error message.
         */
        Logger.prototype.error = function () {
            output.error.apply(output, message(this, arguments));
        };

        /**
         * Assert that the specified condition is true. If it is not, any additional arguments will be logged as an
         * error and the browser debugger will be triggered.
         *
         * @param {Object} condition The condition to check
         */
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