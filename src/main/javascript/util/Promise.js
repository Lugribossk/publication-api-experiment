define(["jquery"],
    function ($) {
        "use strict";

        // Create a fake Promise class to stop IntelliJ warning about it not being found.
        // It is actually a part of jQuery.
        /**
         * @see jQuery documentation
         * @class Promise
         */
        function Promise() {}

        // TODO Fix these to work with any number of arguments.
        // There seems to be a problem with new $.Deferred().reject.apply() returning window.
        return {
            /**
             * Create a rejected promise.
             *
             * @param [arg]
             * @return {Promise}
             */
            rejected: function (arg) {
                return new $.Deferred().reject(arg).promise();
            },
            /**
             * Create a resolved promise.
             *
             * @param [arg]
             * @return {Promise}
             */
            resolved: function (arg) {
                return new $.Deferred().resolve(arg).promise();
            }
        };
    });