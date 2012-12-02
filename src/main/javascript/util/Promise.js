define(["jquery"],
    function ($) {
        "use strict";

        // Create a fake Promise class to stop IntelliJ warning about it not being found.
        // It is actually a part of jQuery.
        /**
         * @see http://api.jquery.com/category/deferred-object/
         * @constructor
         */
        function Promise() {}

        /**
         * @param {Function} doneFilter
         * @param {Function} [failFilter]
         * @param {Function} [progressFilter]
         */
        Promise.prototype.then = function (doneFilter, failFilter, progressFilter) {};
        Promise.prototype.done = function (callback) {};
        Promise.prototype.fail = function (callback) {};
        Promise.prototype.progress = function (callback) {};

        // TODO Fix these to work with any number of arguments.
        // There seems to be a problem with new $.Deferred().reject.apply() returning window.
        /**
         * Create a rejected promise.
         *
         * @param [arg]
         * @return {Promise}
         */
        Promise.rejected = function (arg) {
            return new $.Deferred().reject(arg).promise();
        };

        /**
         * Create a resolved promise.
         *
         * @param [arg]
         * @return {Promise}
         */
        Promise.resolved = function (arg) {
            return new $.Deferred().resolve(arg).promise();
        };

        /**
         * An improved version of $.when() that progresses when individual subordinates are done and returns the values as a single list.
         *
         * The progress event will have the resolved Promise's value and the percentage of subordinates that are done as parameters.
         *
         * Note that due to the way progress() behaves, this function has a rather subtle gotcha when one or more of
         * the subordinates are done already (i.e. non-Promises or already resolved Promises).
         * These will then trigger the progress events <b>synchronously</b> while inside this function call. And unlike
         * done() and fail(), progress() handlers attached later are not called with a previously triggered events.
         * So it is therefore not guaranteed how many progress events the caller will actually get, unless they create
         * their own deferred, set up a progress handler and only then pass it as the combinedDeferred parameter.
         *
         * @param {Object[]} subordinates The subordinates, either Promises or arbitrary values.
         * @param {$.Deferred} [combinedDeferred] The "combined" deferred (not Promise) to use, instead of creating it internally.
         * @return {Promise} A promise for the list of the values of all the subordinates.
         *                   The promise interface of combinedDeferred if that was passed.
         */
        Promise.all = function (subordinates, combinedDeferred) {
            // We would like the returned promise to progress whenever an individual promise has resolved, but $.when() does not support that.
            // So we have to create our own deferred that can be resolved by $.when(), and progressed by done() from the individual promises.
            combinedDeferred = combinedDeferred || new $.Deferred();
            var numDone = 0;

            subordinates.forEach(function (subordinate) {
                // The subordinates can be both promises and already computed synchronous values.
                // This is the same check as in $.when().
                if ($.isFunction(subordinate.promise)) {
                    subordinate.done(function (arg) {
                        numDone++;
                        combinedDeferred.notify.call(this, arg, numDone / subordinates.length);
                    });
                } else {
                    numDone++;
                    combinedDeferred.notify.call(this, subordinate, numDone / subordinates.length);
                }
            });

            $.when.apply(this, subordinates)
                .done(function () {
                    // Return the subordinates' values as one list, instead of as individual arguments.
                    combinedDeferred.resolve($.makeArray(arguments));
                })
                .fail(combinedDeferred.reject);

            return combinedDeferred.promise();
        };

        /**
         * Alternative version of $.when() that always resolves with a list of the return vales of the subordinates that resolved.
         *
         * @param {Object[]} subordinates The subordinates, either Promises or arbitrary values.
         * @return {Promise} A promise for a list of the values of the subordinates that resolved.
         */
        Promise.any = function (subordinates) {
            var combinedDeferred = new $.Deferred();

            subordinates = subordinates.map(function (subordinate) {
                if ($.isFunction(subordinate.promise)) {
                    // Always resolve subordinates rather than reject so the when() deferred always resolves.
                    return subordinate.then(null, function () {
                        return Promise.resolved();
                    });
                } else {
                    return subordinate;
                }
            });

            $.when.apply(this, subordinates)
                .done(combinedDeferred.resolve);

            return combinedDeferred
                .then(function () {
                    // Return the subordinates as one list, instead of as individual arguments.
                    return $.makeArray(arguments).filter(function (item) {
                        // Filter out empty values caused by the resolution above.
                        return item !== undefined;
                    });
                });
        };

        return Promise;
    });