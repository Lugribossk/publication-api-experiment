define(["jquery"],
    function ($) {
        "use strict";

        /**
         * A Publication API "reference".
         * These are used to encapsulate detailed data into separate requests, while allowing responses to return more data than requested.
         * Resolving references correctly then lets us reuse this "bonus" data to avoid requesting it from the server.
         * This is a little complicated, but allows for much better usage of the Content Delivery Network caching.
         *
         * <b>There should be no need to use this class when simply working with the objects returned by PublicationAPI.</b>
         *
         * @param {Object} data The raw object to convert to a Reference object.
         *
         * @class Reference
         * @author Bo Gotthardt
         */
        function Reference(data) {
            // Only one of these three will be set.
            this._resourcePath = data.resourcePath;

            this._resourceURL = data.resourceURL;

            this._bundlePath = data.bundlePath;
            this._bundlePart = data.bundlePart;
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
         * @return {$.Deferred} A deferred that resolves with the data.
         */
        function getBundleReference(path, part) {
            var cachedBundlePart = getBundlePart(path, part);
            if (cachedBundlePart) {
                return new $.Deferred().resolve(cachedBundlePart);
            } else {
                return $.get(Reference.baseURL + path)
                    .then(function (bundle) {
                        saveBundle(path, bundle);
                        return getBundlePart(path, part);
                    });
            }
        }

        /**
         * Get the data that this reference points to.
         *
         * @return {Promise} A promise for the reference data as an {@link Object}.
         */
        Reference.prototype.get = function () {
            var deferred;
            if (this._resourcePath) {
                deferred = $.get(Reference.baseURL + this._resourcePath);
            } else if (this._resourceURL) {
                deferred = $.get(this._resourceURL);
            } else if (this._bundlePath) {
                deferred = getBundleReference(this._bundlePath, this._bundlePart);
            } else {
                console.warn("Unknown reference type", this);
                deferred = new $.Deferred().reject();
            }

            return deferred
                .fail(function () {
                    console.error("Unable to resolve reference", this);
                })
                .promise();
        };

        /**
         * Get the data that this reference points to, as an instance of the specified class.
         *
         * @param {Function} Class The constructor function of the class to use. Must take a single parameter with the reference data as input
         *                          If it has a static construct() method, it will be called with the reference data.
         *                          Otherwise a new instance will be created with the reference data as input.
         * @return {Promise} A promise for the reference data as an instance of Class.
         */
        Reference.prototype.getAs = function (Class) {
            return this.get()
                .then(function (data) {
                    return new Class(data);
                });
        };

        /**
         * Get the data that this reference points to, as a list of instances constructed by the specified class.
         * Assumes that the raw data returned is a list.
         *
         * @param {Function} Class The constructor function of the class to use.
         *                         It must have a static construct method that takes a single parameter with an element of the reference data as input.
         * @return {Promise} A promise for the reference data as a list of instances created by Class.construct().
         */
        Reference.prototype.getEachWith = function (Class) {
            return this.get()
                .then(function (data) {
                    return $.map(data, function (item) {
                        return Class.construct(item);
                    });
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
                return Reference.baseURL + this._resourcePath;
            } else if (this._resourceURL) {
                return this._resourceURL;
            } else {
                console.error("Unable to get binary URL for this reference type.");
                return null;
            }
        };

        /**
         * {String} The base URL used to resolve "resourcePath" and "bundlePath" references.
         * <b>Must</b> be set after publication info has been retrieved.
         */
        Reference.baseURL = null;

        return Reference;
    });