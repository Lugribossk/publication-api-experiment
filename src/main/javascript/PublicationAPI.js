define(["jquery", "Reference", "Publication"],
    function ($, Reference, Publication) {
        "use strict";

        function getPublicationInfoCached(publicationID) {
            return $.ajax({
                url: "http://api.viewer.zmags.com/publication/" + publicationID,
                data: {
                    key: "715f663c48"
                }
            })
                .fail(function (xhr) {
                    console.error("There was a problem getting the cached publication descriptor.", xhr);
                });
        }

        function getPublicationInfoRecent(publicationID) {
            return $.ajax({
                url: "http://api.viewer.zmags.com/publication/" + publicationID,
                data: {
                    key: "715f663c48",
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

        function getPublicationInfo(publicationID) {
            return $.when(getPublicationInfoCached(publicationID),
                getPublicationInfoRecent(publicationID))
                .then(function (info, infoRecent) {
                    // Use the recent publication info instead if we actually got one, and it is newer.
                    if (infoRecent && infoRecent.version > info.version) {
                        info = infoRecent;
                    }
                    console.log("Using pub info", info);
                    // Set the Reference base URL as a static property on it, hopefully it won't change between publications.
                    Reference.baseURL = info.baseURL;
                    return info;
                });
        }

        function getPublicationDescriptor(publicationInfo) {
            return new Reference(publicationInfo.publicationDescriptor).get();
        }

        /**
         *
         * @param apiURL
         * @param key
         * @class PublicationAPI
         */
        function PublicationAPI(apiURL, key) {
            this.apiURL = apiURL;
            this.key = key;
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

            return getPublicationInfo(publicationID)
                .done(function (info) {
                    // Copy useful properties but not the publication descriptor.
                    // Instead load it afterwards and copy its properties in as well.
                    // This encapsulates the abstraction that a publication is split into info and descriptor.
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

        return PublicationAPI;
    });