define(["jquery", "internal/Reference", "publication/Publication", "util/Promise"],
    function ($, Reference, Publication, Promise) {
        "use strict";

        /**
         * Zmags Publication API client that can be used to retrieve publication data.
         *
         * @param {String} key The API key.
         * @param {String} [apiURL] The URL to the Publication Info service. Optional, defaults to the public HTTP version.
         *
         * @class PublicationAPI
         * @author Bo Gotthardt
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
         * @return {Promise} A promise for the info.
         */
        function getPublicationInfoCached(scope, publicationID) {
            return $.ajax({
                url: scope.apiURL + publicationID,
                data: {
                    key: scope.key
                }
            })
                .fail(function (xhr) {
                    console.error("There was a problem getting the cached publication descriptor.", xhr);
                });
        }

        /**
         * Get the recent publication info.
         *
         * @param {PublicationAPI} scope
         * @param {String} publicationID
         * @return {Promise} A promise for the info.
         */
        function getPublicationInfoRecent(scope, publicationID) {
            return $.ajax({
                url: scope.apiURL + publicationID,
                data: {
                    key: scope.key,
                    recent: true
                },
                timeout: 2000
            })
                .then(null, function (xhr, textStatus) {
                    // Timeout shouldn't count as a failure as we're okay with it happening.
                    if (textStatus === "timeout") {
                        return Promise.resolved(null);
                    }
                })
                .fail(function (xhr) {
                    console.error("There was a non-timeout problem getting the recent publication descriptor.", xhr);
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
                    // The parameters are lists of the arguments returned by $.ajax, but we're only interested in the first one.
                    var info = infoResponse[0],
                        infoRecent = infoRecentResponse[0];
                    // Use the recent publication info instead if we actually got one, and it is newer.
                    if (infoRecent && infoRecent.version > info.version) {
                        info = infoRecent;
                    }
                    // Set the Reference base URL, hopefully it won't change between publications.
                    Reference.setBaseURL(info.baseURL);
                    return info;
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
                console.error("No publication descriptor, perhaps the publication is not activated?");
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