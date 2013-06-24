define(["is!node?util/node/Ajax:util/jquery/Ajax"],
    function (Ajax) {
        "use strict";

        /**
         * Utility class for encapsulating Ajax calls.
         *
         * This allows the implementation to work with both jQuery and NodeJS.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        return Ajax;
    });