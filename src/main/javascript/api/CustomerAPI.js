define(["jquery", "api/PublicationAPI", "util/Logger", "util/Promise", "util/window"],
    function ($, PublicationAPI, Logger, Promise, window) {
        "use strict";
        var log = new Logger("CustomerAPI");

        /**
         * Zmags Customer API client that can be used to retrieve publications for specific customers.
         * Also known as the "Publication<b>s</b> API".
         *
         *     @example
         *     require(["jquery", "api/CustomerAPI"],
         *         function ($, CustomerAPI) {
         *             new CustomerAPI("2a39a9615b").getAllPublications("85d291bd")
         *                 .then(function (publications) {
         *                     var pages = publications.map(function (publication) {
         *                         return publication.getPage(1);
         *                     });
         *                     return $.when.apply(this, pages);
         *                 })
         *                 .then(function () {
         *                     $.makeArray(arguments).forEach(function (page) {
         *                         page.createDomElement({width: 180, height: 180}, null, true).appendTo("body");
         *                     });
         *                     $(".Page").css({float: "left"});
         *                 });
         *         });
         *
         * @class api.CustomerAPI
         * @alternateClassName CustomerAPI
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {String} key The API key.
         * @param {String} [apiURL] The URL to the Customer Publication List service.
         *                          Optional, defaults to the same protocol as the current page.
         */
        function CustomerAPI(key, apiURL) {
            this._key = key;
            this._apiURL = apiURL ||
                window.location.protocol === "https:" ? CustomerAPI.HTTPS_URL : CustomerAPI.HTTP_URL;
            this._publicationAPI = new PublicationAPI(key);
        }


        /**
         * Get all of the specified customer's publications.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} customerID The ID of the customer, as seen in the Publicator under TODO.
         * @return {Promise} A promise for the list of {@link Publication}s.
         */
        CustomerAPI.prototype.getAllPublications = function (customerID) {
            var scope = this;

            return $.ajax({
                url: this._apiURL + customerID,
                data: {
                    key: this._key
                }
            })
                .fail(function (xhr) {
                    log.error("There was a problem retrieving the publication ID list.", xhr);
                })
                .then(function (data) {
                    return scope._publicationAPI.getPublications(data.publicationIDs);
                });
        };

        /**
         * The URL to the HTTP version of the Customer Publication List service.
         * @static
         * @const
         * @type {String}
         */
        CustomerAPI.HTTP_URL = "http://api.viewer.zmags.com/publications/";

        /**
         * The URL to the HTTPS version of the Customer Publication List service.
         * @static
         * @const
         * @type {String}
         */
        CustomerAPI.HTTPS_URL = "https://secure.api.viewer.zmags.com/publications/";

        return CustomerAPI;
    });
