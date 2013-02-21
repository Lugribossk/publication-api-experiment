define(["jquery", "lib/XDomainRequest"],
    function ($, XDomainRequest) {
        "use strict";

        /**
         * Utility class for encapsulating Ajax calls, that work cross-domain without JSONP in IE8/9.
         *
         * This allows the implementation to be changed to another library without rewriting more than this class.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function Ajax() {}

        /**
         * GET data from a server.
         *
         * @static
         *
         * @param {Object} settings Object with request settings such as URL and parameters.
         * @return {Promise} A promise for the response data.
         */
        Ajax.get = function (settings) {
            return $.ajax(settings).promise();
        };

        // Non-JSONP cross-domain support in IE 8/9:
        // 1. Use XDomainRequest jQuery plugin to add support for this.
        // 2. Set jQuery Ajax defaults so the plugin will always be triggered.
        $.ajaxSetup({
            dataType: "json",
            timeout: 20000
        });

        return Ajax;
    });