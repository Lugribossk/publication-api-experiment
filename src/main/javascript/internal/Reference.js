define(["jquery", "util/Promise", "util/Logger"],
    function ($, Promise, Logger) {
        "use strict";
        var log = new Logger("Reference");

        var baseURL = null;

        /**
         * A Publication API "reference".
         * These are used to encapsulate detailed data into separate requests, while allowing responses to return more data than requested.
         * Resolving references correctly then lets us reuse this "bonus" data to avoid requesting it from the server.
         * This is a little complicated, but allows for much better usage of the Content Delivery Network caching.
         *
         * <b>There should be no need to use this class when simply working with the objects returned by PublicationAPI.</b>
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw object to convert to a Reference object.
         */
        function Reference(data) {
            if (data.resourcePath) {
                this._resourcePath = data.resourcePath;
            } else if (data.resourceURL) {
                this._resourceURL = data.resourceURL;
            } else if (data.bundlePath) {
                this._bundlePath = data.bundlePath;
                this._bundlePart = data.bundlePart;
            } else {
                log.error("Unknown reference type", data);
            }
        }

        /**
         * {Object} A map of bundle paths to their bundles.
         * A bundle is then a map of bundle parts to their data.
         */
        var bundleCache = {};

        /**
         * Get a bundle part's data from the cache.
         *
         * @param {String} path The bundle path.
         * @param {String} part The bundle part.
         * @return {Object} The data, or null if it was not cached.
         */
        function getBundlePart(path, part) {
            return bundleCache[path] && bundleCache[path][part];
        }

        /**
         * Cache a bundle so its parts can be reused later.
         *
         * @param {String} path The bundle path it was retrieved from.
         * @param {Object} bundle The bundle object that maps bundle parts to their data.
         */
        function saveBundle(path, bundle) {
            bundleCache[path] = bundle;
        }

        /**
         * Get the data for a "bundle" reference type.
         *
         * @param {String} path The bundle path.
         * @param {String} part The bundle part.
         * @return {Promise} A promise for the data.
         */
        function getBundleReference(path, part) {
            var cachedBundlePart = getBundlePart(path, part);
            if (cachedBundlePart) {
                return Promise.resolved(cachedBundlePart);
            }
            return $.get(baseURL + path)
                .then(function (bundle) {
                    saveBundle(path, bundle);
                    return getBundlePart(path, part);
                });
        }

        /**
         * Get the data that this reference points to.
         *
         * @return {Promise} A promise for the reference data as an {@link Object}.
         */
        Reference.prototype.get = function () {
            var promise;
            if (this._resourcePath) {
                promise = $.get(baseURL + this._resourcePath).promise();
            } else if (this._resourceURL) {
                promise = $.get(this._resourceURL).promise();
            } else if (this._bundlePath) {
                promise = getBundleReference(this._bundlePath, this._bundlePart);
            } else {
                promise = Promise.rejected();
            }

            return promise
                .fail(function () {
                    log.error("Unable to resolve reference", this);
                }.bind(this));
        };

        /**
         * Get the data that this reference points to, as an instance of the specified class.
         *
         * @param {Function} Class The constructor function of the class to use. Must take a single parameter with the reference data as input.
         * @return {Promise} A promise for the reference data as an instance of Class.
         */
        Reference.prototype.getAs = function (Class) {
            return this.get()
                .then(function (data) {
                    return new Class(data);
                });
        };

        /**
         * Get the data that this reference points to, as a list of instances constructed by the specified function.
         * Assumes that the raw data returned is a list.
         *
         * @param {Function} parserFunction The function to call with each item of raw data to parse them into some kind of object.
         *                                  Must take a single parameter with the reference data as input.
         * @return {Promise} A promise for the reference data as a list of objects created by the parsing function.
         */
        Reference.prototype.getEachWith = function (parserFunction) {
            return this.get()
                .then(function (data) {
                    log.assert(Array.isArray(data), "Reference must resolve to a list, was", data);
                    return data.map(parserFunction);
                });
        };

        /**
         * Get the URL to a binary file that this reference points to.
         * Only call this on references you know point to binary URLs, such as page representation references.
         *
         * @return {String}
         */
        Reference.prototype.getBinaryURL = function () {
            if (this._resourcePath) {
                return baseURL + this._resourcePath;
            }
            if (this._resourceURL) {
                return this._resourceURL;
            }
            log.error("Unable to get binary URL for bundle path/part reference type.");
            return null;
        };

        /**
         * Set the base URL used to resolve "resourcePath" and "bundlePath" references.
         * <b>Must</b> be set after publication info has been retrieved.
         *
         * @static
         * @param {String} url The base URL
         */
        Reference.setBaseURL = function (url) {
            if (baseURL && baseURL !== url) {
                log.error("Inconsistent publication base URLs. This use case is not supported by the current implementation.");
            } else {
                baseURL = url;
            }
        };

        return Reference;
    });