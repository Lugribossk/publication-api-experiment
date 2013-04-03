define(["jquery", "internal/Reference", "publication/Publication", "util/Promise", "util/Logger", "util/Browser", "util/Ajax"],
    function ($, Reference, Publication, Promise, Logger, Browser, Ajax) {
        "use strict";
        var log = new Logger("PublicationAPI");

        /**
         * Client for the Zmags Publication API that can be used to retrieve publication data.
         *
         *     @example
         *     require(["jquery", "api/PublicationAPI", "view/SimplePublicationView"],
         *         function ($, PublicationAPI) {
         *             new PublicationAPI("2a39a9615b").getPublication("952ac7ea")
         *                 .done(function (publication) {
         *                     publication.createDomElement({width: 150, height: 150}).appendTo("body");
         *                     $(".Page").css({float: "left"});
         *                 });
         *         });
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {String} key The API key, as seen in the Publicator under TODO.
         * @param {String} [apiDomain] The domain to communicate with the API on.
         *                          Optional, defaults to an appropriate value based on the protocol used for the current page.
         */
        function PublicationAPI(key, apiDomain) {
            this._key = key;
            this._apiDomain = apiDomain || (Browser.isSecure() ? PublicationAPI.SECURE_DOMAIN : PublicationAPI.DOMAIN);
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
         * Get the Ajax settings used for retrieving publication info.
         *
         * @private
         *
         * @param {String} publicationID The publication ID.
         * @param {Boolean} [preview=false] Whether to use preview mode.
         * @return {Object}
         */
        PublicationAPI.prototype._getAjaxParameters = function (publicationID, preview) {
            var params = {
                url: this._apiDomain + "publication/" + publicationID,
                data: {
                    key: this._key
                }
            };

            if (preview) {
                params.data.viewType = "pubPreview";
            }

            return params;
        };

        /**
         * Get the cached publication info.
         *
         * @private
         *
         * @param {String} publicationID The publication ID.
         * @param {Boolean} [preview=false] Whether to use preview mode.
         * @return {Promise} A promise for the info. Will resolve with null instead of reject.
         */
        PublicationAPI.prototype._getPublicationInfoCached = function (publicationID, preview) {
            return Ajax.get(this._getAjaxParameters(publicationID, preview))
                .then(null, function (xhr) {
                    log.warn("There was a problem getting the cached publication descriptor.", xhr);
                    return Promise.resolved(null);
                });
        };

        /**
         * Get the recent publication info.
         *
         * @private
         *
         * @param {String} publicationID The publication ID.
         * @param {Boolean} [preview=false] Whether to use preview mode.
         * @return {Promise} A promise for the info. Will resolve with null instead of reject.
         */
        PublicationAPI.prototype._getPublicationInfoRecent = function (publicationID, preview) {
            var params = this._getAjaxParameters(publicationID, preview);
            params.data.recent = true;
            // Set a low timeout as the recent response may be slow due to not being cached as well.
            params.timeout = 10000;

            return Ajax.get(params)
                .then(null, function (xhr, textStatus) {
                    if (textStatus === "timeout") {
                        log.warn("Timeout while getting the recent publication descriptor.");
                    } else {
                        log.warn("There was a non-timeout problem getting the recent publication descriptor.", xhr);
                    }
                    return Promise.resolved(null);
                });
        };

        /**
         * Get the specified publication's "publication info", respecting the rule about firing off two requests.
         *
         * @private
         *
         * @param {String} publicationID The publication ID.
         * @param {Boolean} [preview=false] Whether to use preview mode. <b>Note that this is potentially a lot slower</b>, but
         * @return {Promise} A promise for the publication info.
         */
        PublicationAPI.prototype._getPublicationInfo = function (publicationID, preview) {
            return $.when(this._getPublicationInfoCached(publicationID, preview),
                          this._getPublicationInfoRecent(publicationID, preview))
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
        };

        /**
         * Get the specified publication.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} publicationID The ID of the publication, as seen in the Publicator under All Publications -> Edit Publication.
         * @param {Boolean} [preview=false] Whether to use preview mode where changes from the Publicator are visible immediately.
         *                                  <b>Note that this is a lot slower and thus should not be used for production code!</b>
         * @param {Boolean} [ignoreNotActivated=false] Whether to ignore that the publication has not been activated and resolve with null, rather than fail and log an error.
         * @return {Promise} A promise for the {@link Publication}, that fails if unable to create it.
         */
        PublicationAPI.prototype.getPublication = function (publicationID, preview, ignoreNotActivated) {
            var publicationInfo;

            return this._getPublicationInfo(publicationID, preview)
                .then(function (info) {
                    publicationInfo = info;

                    if (!info.publicationDescriptor && ignoreNotActivated) {
                        return Promise.resolved(null);
                    }

                    return getPublicationDescriptor(info);
                })
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
                return this.getPublication(publicationID, false, true);
            }, this);

            return Promise.any(publications);
        };

        /**
         * Get all of the specified customer's publications.
         * Note that publications that are not activated or are security restricted may not be available.
         *
         * @param {String} customerID The ID of the customer, as seen in the Publicator under TODO.
         * @return {Promise} A promise for the list of {@link Publication}s.
         */
        PublicationAPI.prototype.getAllPublications = function (customerID) {
            var scope = this;

            return Ajax.get({
                url: this._apiDomain + "publications/" + customerID,
                data: {
                    key: this._key
                }
            })
                .fail(function (xhr) {
                    log.error("There was a problem retrieving the publication ID list.", xhr);
                })
                .then(function (data) {
                    return scope.getPublications(data.publicationIDs);
                });
        };

        /**
         * The domain used for communicating with the API over HTTP.
         * @static
         * @const
         * @type {String}
         */
        PublicationAPI.DOMAIN = "http://api.viewer.zmags.com/";

        /**
         * The domain used for communicating with the API over HTTPS.
         * This is different from HTTP due to Content Delivery Network caching.
         * @static
         * @const
         * @type {String}
         */
        PublicationAPI.SECURE_DOMAIN = "https://secure.api.viewer.zmags.com/";

        return PublicationAPI;
    });