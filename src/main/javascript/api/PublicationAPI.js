define(["jquery", "internal/Reference", "publication/Publication", "util/Promise", "util/Logger"],
    function ($, Reference, Publication, Promise, Logger) {
        "use strict";
        var log = new Logger("PublicationAPI");

        /**
         * Zmags Publication API client that can be used to retrieve publication data.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {String} key The API key.
         * @param {String} [apiURL] The URL to the Publication Info service. Optional, defaults to the public HTTP version.
         */
        function PublicationAPI(key, apiURL) {
            this.key = key;
            this.apiURL = apiURL || PublicationAPI.APIUrl.HTTP;
        }

        /**
         * Get the cached publication info.
         *
         * @param {PublicationAPI} scope
         * @param {String} publicationID
         * @return {Promise} A promise for the info. Will resolve with null instead of reject.
         */
        function getPublicationInfoCached(scope, publicationID) {
            return $.ajax({
                url: scope.apiURL + publicationID,
                data: {
                    key: scope.key
                }
            })
                .then(null, function (xhr) {
                    log.warn("There was a problem getting the cached publication descriptor.", xhr);
                    return Promise.resolved(null);
                });
        }

        /**
         * Get the recent publication info.
         *
         * @param {PublicationAPI} scope
         * @param {String} publicationID
         * @return {Promise} A promise for the info. Will resolve with null instead of reject.
         */
        function getPublicationInfoRecent(scope, publicationID) {
            return $.ajax({
                url: scope.apiURL + publicationID,
                data: {
                    key: scope.key,
                    recent: true
                },
                // Set a timeout as the recent response may be slow due to not being cached as well.
                timeout: 2000
            })
                .then(null, function (xhr, textStatus) {
                    if (textStatus === "timeout") {
                        log.warn("Timeout while getting the recent publication descriptor.");
                    } else {
                        log.warn("There was a non-timeout problem getting the recent publication descriptor.", xhr);
                    }
                    return Promise.resolved(null);
                });
        }

        /**
         * Get the specified publication's "publication info", respecting the rule about firing off two requests.
         *
         * @param {PublicationAPI} scope
         * @param {String} publicationID The publication ID.
         * @return {Promise} A promise for the publication info.
         */
        function getPublicationInfo(scope, publicationID) {
            return $.when(getPublicationInfoCached(scope, publicationID),
                          getPublicationInfoRecent(scope, publicationID))
                .then(function (infoResponse, infoRecentResponse) {
                    var info,
                        infoRecent;
                    // Both requests have been set to always resolve, so we can continue if one of them fails.
                    // The parameters are lists of the arguments returned by $.ajax, but we're only interested in the first one.
                    if (infoResponse) {
                        info = infoResponse[0];
                    }
                    if (infoRecentResponse) {
                        infoRecent = infoRecentResponse[0];
                    }

                    // TODO Can activation status change without version being bumped?

                    // If we got both, use the recent publication info if it is newer.
                    if (infoRecent && info && infoRecent.version > info.version) {
                        return infoRecent;
                    } else {
                        return info || infoRecent || Promise.rejected();
                    }
                })
                .done(function (info) {
                    // Set the Reference base URL, hopefully it won't change between publications.
                    Reference.setBaseURL(info.baseURL);
                })
                .fail(function () {
                    log.error("Unable to retrieve any publication info.");
                });
        }

        /**
         * Get the specified publication info's publication descriptor.
         *
         * @param {Object} publicationInfo The publication info.
         * @return {Promise} A promise for the publication descriptor.
         */
        function getPublicationDescriptor(publicationInfo) {
            if (publicationInfo.publicationDescriptor) {
                return new Reference(publicationInfo.publicationDescriptor).get();
            } else {
                log.error("No publication descriptor, perhaps the publication is not activated?");
                return Promise.rejected();
            }
        }



        /**
         * Get the specified publication.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} publicationID The ID of the publication, as seen in the Publicator UI.
         * @return {Promise} A promise for the {@link Publication}, that fails if unable to create it.
         */
        PublicationAPI.prototype.getPublication = function (publicationID) {
            var publicationInfo;

            return getPublicationInfo(this, publicationID)
                .done(function (info) {
                    publicationInfo = info;
                })
                .then(getPublicationDescriptor)
                .then(function (publicationDescriptor) {
                    // Create the publication with both info and descriptor, in order to encapsulate the implementation
                    // detail that this is split into two objects from different requests.
                    return new Publication(publicationID, publicationInfo, publicationDescriptor);
                });
        };

        PublicationAPI.APIUrl = {
            /**
             * {String} The URL to the HTTP version of the Publication Info service.
             */
            HTTP: "http://api.viewer.zmags.com/publication/",

            /**
             * {String} The URL to the HTTPS version of the Publication Info service.
             */
            HTTPS: "https://secure.api.viewer.zmags.com/publication/"
        };

        return PublicationAPI;
    });