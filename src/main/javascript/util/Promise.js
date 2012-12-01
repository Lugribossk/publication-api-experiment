define(["jquery"],
    function ($) {
        "use strict";

        // Create a fake Promise class to stop IntelliJ warning about it not being found.
        // It is actually a part of jQuery.
        /**
         * @see http://api.jquery.com/category/deferred-object/
         * @class Promise
         */
        function Promise() {}

        /**
         * @param doneFilter
         * @param [failFilter]
         * @param [progressFilter]
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
         * An improved version of $.when() that progresses when individual <b>pending</b> subordinates are done.
         *
         * The progress event will have the same parameters as the resolved Promise, plus a final one with the percentage of subordinates that are done.
         *
         * Note that due to the way progress() behaves, this function has a rather subtle gotcha when one or more of
         * the subordinates are done already (i.e. non-Promises or already resolved Promises).
         * These will then generate the progress events *synchronously* while inside this function call. And unlike
         * done() and fail(), progress() handlers attached later are not called with a previously triggered events.
         * So it is therefore not guaranteed how many progress events the caller will actually get.
         *
         * TODO Take a deferred as input where the caller has already set up progress()?
         *
         * @param {Object[]} subordinates
         * @return {Promise} The combined promise for the values of all the subordinates.
         */
        Promise.when = function (subordinates) {
            // We would like the returned promise to progress whenever an individual promise has resolved, but $.when() does not support that.
            // So we have to create our own deferred that can be resolved by $.when(), and progressed by done() from the individual promises.
            var combinedDeferred = new $.Deferred(),
                numDone = 0;

            subordinates.forEach(function (subordinate) {
                // The subordinates can be both promises and already computed synchronous values.
                // This is the same check as in $.when().
                if ($.isFunction(subordinate.promise) && subordinate.state() === "pending") {
                    subordinate.done(function () {
                        numDone++;
                        var args = $.makeArray(arguments);
                        args.push(numDone / subordinates.length);
                        combinedDeferred.notify.apply(this, args);
                    });
                } else {
                    // Don't bother calling notify() here as no one could possibly be listening for that yet.
                    numDone++;
                }
            });

            $.when.apply(this, subordinates)
                .done(combinedDeferred.resolve)
                .fail(combinedDeferred.reject);

            return combinedDeferred.promise();
        };

        /**
         * Alternative version of $.when() that always resolves with a list of the return vales of the subordinates that resolved.
         *
         * @param {Object[]} subordinates
         * @return {Promise}
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