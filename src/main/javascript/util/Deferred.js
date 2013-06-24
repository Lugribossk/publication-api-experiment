define(["is!node?util/node/Deferred:util/jquery/Deferred"],
    function (Deferred) {
        "use strict";

        /**
         * Utility class for encapsulating deferreds.
         *
         * This allows the implementation to work with both jQuery and NodeJS.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        return Deferred;
    });