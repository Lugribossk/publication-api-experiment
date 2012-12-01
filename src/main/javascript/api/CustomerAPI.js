define(["jquery", "api/PublicationAPI", "util/Logger", "util/Promise"],
    function ($, PublicationAPI, Logger, Promise) {
        "use strict";
        var log = new Logger("CustomerAPI");

        /**
         * Zmags Customer API client that can be used to retrieve publications.
         * Also known as the "Publication<b>s</b> API".
         *
         * @param {String} key The API key.
         * @param {String} [apiURL] The URL to the Customer Publication List service. Optional, defaults to the public HTTP version.
         *
         * @class CustomerAPI
         * @author Bo Gotthardt
         */
        function CustomerAPI(key, apiURL) {
            this.key = key;
            this.apiURL = apiURL || CustomerAPI.APIUrl.HTTP;
            this.publicationAPI = new PublicationAPI(key);
        }

        /**
         * Get all of the specified customer's publications.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} customerID The ID of the customer.
         * @return {Promise} A promise for the list of {@link Publication}s.
         */
        CustomerAPI.prototype.getPublications = function (customerID) {
            var scope = this;

            return $.ajax({
                url: this.apiURL + customerID,
                data: {
                    key: this.key
                }
            })
                .fail(function (xhr) {
                    log.error("There was a problem retrieving the publication ID list.", xhr);
                })
                .then(function (data) {
                    var deferreds = data.publicationIDs.map(function (publicationID) {
                        return scope.publicationAPI.getPublication(publicationID)
                            .fail(function () {
                                log.warn("Unable to retrieve publication", publicationID);
                            });
                    });

                    return Promise.any(deferreds);
                });
        };

        CustomerAPI.APIUrl = {
            HTTP: "http://api.viewer.zmags.com/publications/",
            HTTPS: "https://secure.api.viewer.zmags.com/publications/"
        };

        return CustomerAPI;
    });
