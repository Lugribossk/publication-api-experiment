/*global console*/
define(["jquery", "util/Promise", "util/ES5"],
    function ($, Promise, ES5) { // ES5 only to force it being loaded before its functionality is required, as this class is one of the earliest loaded.
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
         * Use the specified console function name to print the list of data.
         *
         * @private
         *
         * @param {String} functionName
         * @param {Arguments/ *[]} dataList
         */
        Logger.prototype._callPrintFunction = function (functionName, dataList) {
            // Chrome requires the console as it's own context.
            // IE doesn't inherit the logging functions from Function.
            var func = Function.prototype.bind.call(output[functionName], output);
            var messages = ["[" + this._name + "]"].concat($.makeArray(dataList));
            func.apply(output, messages);
        };

        /**
         * Print the list of data to the console.
         * If there is only one argument and it is a Promise, it's resolved value will be logged instead.
         *
         * @private
         *
         * @param {String} functionName
         * @param {Arguments} dataList
         */
        Logger.prototype._print = function (functionName, dataList) {
            var scope = this;
            if (Promise.isPromise(dataList[0]) && dataList.length === 1) {
                dataList[0]
                    .done(function () {
                        scope._callPrintFunction(functionName, arguments);
                    })
                    .fail(function () {
                        scope._callPrintFunction(functionName, ["Promise failed."]);
                    });
            } else {
                scope._callPrintFunction(functionName, dataList);
            }

        };

        /**
         * Log informational message.
         */
        Logger.prototype.info = function () {
            this._print("info", arguments);
        };

        /**
         * Log warning about undesired behavior.
         */
        Logger.prototype.warn = function () {
            this._print("warn", arguments);
        };

        /**
         * Log error message.
         */
        Logger.prototype.error = function () {
            this._print("error", arguments);
        };

        /**
         * Assert that the specified condition is true. If it is not, any additional arguments will be logged as an
         * error and the browser debugger will be triggered.
         *
         * @param {*} condition The condition to check
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