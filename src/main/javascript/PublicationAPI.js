define(["jquery", "Reference", "Publication"],
    function ($, Reference, Publication) {
        "use strict";

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
                    if (textStatus === "timeout") {
                        return new $.Deferred.resolve(null);
                    }
                })
                .fail(function (xhr) {
                    console.error("There was a non-timeout problem getting the recent publication descriptor.", xhr);
                });
        }

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
                    // Set the Reference base URL as a static property on it, hopefully it won't change between publications.
                    Reference.baseURL = info.baseURL;
                    return info;
                });
        }

        function getPublicationDescriptor(publicationInfo) {
            return new Reference(publicationInfo.publicationDescriptor).get();
        }

        /**
         * Zmags Publication API client that can be used to retrieve publication data.
         *
         * @param {String} key The API key.
         * @param {String} [apiURL] The URL to the "Publication Info service". Optional, defaults to the public HTTP version.
         *
         * @class PublicationAPI
         * @author Bo Gotthardt
         */
        function PublicationAPI(key, apiURL) {
            this.key = key;
            this.apiURL = apiURL || PublicationAPI.HTTP_URL;
            this.baseURL = null;
        }

        /**
         * Get the specified publication.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} publicationID The ID of the publication, as seen in the Publicator UI.
         * @return {$.Deferred} A deferred that resolves with the publication, or fails if unable to create it.
         */
        PublicationAPI.prototype.getPublication = function (publicationID) {
            var publication = new Publication(publicationID);

            return getPublicationInfo(this, publicationID)
                .done(function (info) {
                    // Copy useful properties but not the publication descriptor.
                    // Instead load it afterwards and copy its properties in as well.
                    // This encapsulates the detail that a publication is split into info and descriptor.
                    publication.version = info.version;
                    publication.expired = info.expired;
                    publication.activated = info.activated;
                })
                .then(getPublicationDescriptor)
                .then(function (publicationDescriptor) {
                    $.extend(publication, publicationDescriptor);
                    return publication;
                });
        };

        PublicationAPI.HTTP_URL = "http://api.viewer.zmags.com/publication/";
        PublicationAPI.HTTPS_URL = "https://secure.api.viewer.zmags.com/publication/";

        return PublicationAPI;
    });