define(["jquery", "internal/Reference", "publication/Publication", "util/Promise", "util/Logger", "util/Browser"],
    function ($, Reference, Publication, Promise, Logger, Browser) {
        "use strict";
        var log = new Logger("PublicationAPI");

        /**
         * Client for the Zmags Publication API that can be used to retrieve publication data.
         *
         *     @example
         *     require(["api/PublicationAPI"],
         *         function (PublicationAPI) {
         *             new PublicationAPI("2a39a9615b").getPublication("952ac7ea")
         *                 .done(function (publication) {
         *                     publication.createDomElement({width: 180, height: 180}).appendTo("body");
         *                     $(".Page").css({float: "left"});
         *                 });
         *         });
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {String} key The API key.
         * @param {String} [apiURL] The URL to the Publication Info service.
         *                          Optional, defaults to the same protocol as the current page.
         */
        function PublicationAPI(key, apiURL) {
            this._key = key;
            this._apiURL = apiURL ||
                (Browser.getWindow().location.protocol === "https:" ? PublicationAPI.HTTPS_URL : PublicationAPI.HTTP_URL);
        }


        /**
         * Get the cached publication info.
         *
         * @private
         * @static
         *
         * @param {PublicationAPI} scope
         * @param {String} publicationID
         * @return {Promise} A promise for the info. Will resolve with null instead of reject.
         */
        function getPublicationInfoCached(scope, publicationID) {
            return $.ajax({
                url: scope._apiURL + publicationID,
                data: {
                    key: scope._key
                },
                dataType: "json",
                timeout: 20000
            })
                .then(null, function (xhr) {
                    log.warn("There was a problem getting the cached publication descriptor.", xhr);
                    return Promise.resolved(null);
                });
        }

        /**
         * Get the recent publication info.
         *
         * @private
         * @static
         *
         * @param {PublicationAPI} scope
         * @param {String} publicationID
         * @return {Promise} A promise for the info. Will resolve with null instead of reject.
         */
        function getPublicationInfoRecent(scope, publicationID) {
            return $.ajax({
                url: scope._apiURL + publicationID,
                data: {
                    key: scope._key,
                    recent: true
                },
                dataType: "json",
                // Set a low timeout as the recent response may be slow due to not being cached as well.
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
         * @private
         * @static
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
                    }
                    return info || infoRecent || Promise.rejected();
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
         * @private
         * @static
         *
         * @param {Object} publicationInfo The publication info.
         * @return {Promise} A promise for the publication descriptor.
         */
        function getPublicationDescriptor(publicationInfo) {
            if (!publicationInfo.publicationDescriptor) {
                log.error("No publication descriptor, perhaps the publication is not activated?");
                return Promise.rejected();
            }
            return new Reference(publicationInfo.publicationDescriptor).get();
        }



        /**
         * Get the specified publication.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} publicationID The ID of the publication, as seen in the Publicator under All Publications -> Edit Publication.
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

        /**
         * Get the specified publications.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String[]} publicationIDs A list of the IDs of the publications.
         * @return {Promise} A promise for the list of {@link Publication}s.
         */
        PublicationAPI.prototype.getPublications = function (publicationIDs) {
            var publications = publicationIDs.map(function (publicationID) {
                return this.getPublication(publicationID);
            }, this);

            return Promise.any(publications);
        };

        /**
         * The URL to the HTTP version of the Publication Info service.
         * @static
         * @const
         * @type {String}
         */
        PublicationAPI.HTTP_URL = "http://api.viewer.zmags.com/publication/";

        /**
         * The URL to the HTTPS version of the Publication Info service.
         * @static
         * @const
         * @type {String}
         */
        PublicationAPI.HTTPS_URL = "https://secure.api.viewer.zmags.com/publication/";

        return PublicationAPI;
    });