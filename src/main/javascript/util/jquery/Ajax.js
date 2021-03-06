define(["jquery", "lib/XDomainRequest"],
    function ($, XDomainRequest) {
        "use strict";

        /**
         * jQuery-based Ajax request that works cross-domain without JSONP in IE8/9.
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
            // Non-JSONP cross-domain support in IE 8/9:
            // 1. Use XDomainRequest jQuery plugin to add support for this.
            // 2. Set jQuery Ajax defaults so the plugin will always be triggered.
            if (!settings.dataType) {
                settings.dataType = "json";
            }
            if (settings.timeout === undefined) {
                settings.timeout = 30000;
            }

            return $.ajax(settings).promise();
        };

        return Ajax;
    });