/**
 * Some custom matchers for Jasmine.
 *
 * @author Bo Gotthardt
 */
define([],
    function () {
        "use strict";

        return {
            /**
             * Expect the actual value to be a Promise that has *already* resolved with the specified value.
             *
             * @param {*} expectedValue
             * @return {Boolean}
             */
            toHaveResolvedWith: function (expectedValue) {
                var actualValue;

                if (this.actual.state() !== "resolved") {
                    this.message = function () { return "Expected promise to have resolved."; };
                    return false;
                }

                this.actual.done(function (value) {
                    actualValue = value;
                });

                if (actualValue === undefined) {
                    this.message = function () { return "Expected done() callback to have been called."; };
                    return false;
                }

                this.message = function () { return "Expected " + actualValue + (this.isNot ? " not" : "") + " to equal " + expectedValue; };
                return this.env.equals_(actualValue, expectedValue);
            }
        };
    });