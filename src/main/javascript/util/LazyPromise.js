define(["jquery", "util/Promise"],
    function ($, Promise) {
        "use strict";

        /**
         * A "lazy" Promise that does not start calculating its value until the first handler is added to it.
         * Useful to set up Ajax requests that are not actually fired until needed.
         *
         * @implements Promise
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Function} valueGenerator A function that generates the promised value.
         *                                  If it returns a {@link Promise}, it's resolution/rejection/progress will be used for the lazy promise.
         *                                  If it returns any other kind of value, the lazy promise will resolve with this.
         */
        function LazyPromise(valueGenerator) {
            this._valueGenerator = valueGenerator;
            this._deferred = new $.Deferred();
            this._triggered = false;
        }

        /**
         * Trigger the value generation if this has not already been done.
         *
         * @private
         */
        LazyPromise.prototype._trigger = function () {
            if (!this._triggered) {
                this._triggered = true;

                var value = this._valueGenerator();
                if (Promise.isPromise(value)) {
                    value
                        .done(this._deferred.resolve)
                        .fail(this._deferred.reject)
                        .progress(this._deferred.notify);
                } else {
                    this._deferred.resolve(value);
                }
            }
        };

        /**
         * See <a href="http://api.jquery.com/deferred.then/">deferred.then()</a>.
         *
         * @param {Function} doneFilter
         * @param {Function} [failFilter]
         * @param {Function} [progressFilter]
         */
        LazyPromise.prototype.then = function (doneFilter, failFilter, progressFilter) {
            this._trigger();
            this._deferred.then(doneFilter, failFilter, progressFilter);
        };

        /**
         * See <a href="http://api.jquery.com/deferred.done/">deferred.done()</a>.
         *
         * @param {Function} callback
         */
        LazyPromise.prototype.done = function (callback) {
            this._trigger();
            this._deferred.done(callback);
        };

        /**
         * See <a href="http://api.jquery.com/deferred.fail/">deferred.fail()</a>.
         *
         * @param {Function} callback
         */
        LazyPromise.prototype.fail = function (callback) {
            this._trigger();
            this._deferred.fail(callback);
        };

        /**
         * See <a href="http://api.jquery.com/deferred.progress/">deferred.progress()</a>.
         *
         * @param {Function} callback
         */
        LazyPromise.prototype.progress = function (callback) {
            this._trigger();
            this._deferred.progress(callback);
        };

        return LazyPromise;
    });