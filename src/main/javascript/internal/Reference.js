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
         * @param {Object} rawReference The raw object to convert to a Reference object.
         *
         * @class Reference
         * @author Bo Gotthardt
         */
        function Reference(rawReference) {
            $.extend(this, rawReference);
        }

        var bundleCache = {};
        function getBundlePart(scope) {
            return bundleCache[scope.bundlePath] && bundleCache[scope.bundlePath][scope.bundlePart];
        }

        function saveBundle(scope, bundle) {
            bundleCache[scope.bundlePath] = bundle;
        }

        function getBundleReference(scope) {
            var cachedBundlePart = getBundlePart(scope);
            if (cachedBundlePart) {
                return new $.Deferred().resolve(cachedBundlePart);
            } else {
                return $.get(Reference.baseURL + scope.bundlePath)
                    .then(function (bundle) {
                        saveBundle(scope, bundle);
                        return getBundlePart(scope);
                    });
            }
        }

        /**
         * Get the data that this reference points to.
         *
         * @return {$.Deferred} A deferred that resolves with the reference data.
         */
        Reference.prototype.get = function () {
            var deferred;
            if (this.resourcePath) {
                deferred = $.get(Reference.baseURL + this.resourcePath);
            } else if (this.resourceURL) {
                deferred = $.get(this.resourceURL);
            } else if (this.bundlePath) {
                deferred = getBundleReference(this);
            } else {
                console.error("Unknown reference type", this);
                deferred = new $.Deferred().reject();
            }

            return deferred
                .fail(function () {
                    console.error("Unable to resolve reference", this);
                });
        };

        /**
         * Get the data that this reference points to, as an instance of the specific class.
         *
         * @param {Function} Class The constructor function of the class to use.
         *                          If it has a static construct() method, it will be called with the reference data.
         *                          Otherwise a new instance will be created with the reference data as input.
         * @return {$.Deferred} A deferred that resolves with the data instance
         */
        Reference.prototype.getAs = function (Class) {
            return this.get()
                .then(function (data) {
                    return new Class(data);
                });
        };

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
            if (this.resourcePath) {
                return Reference.baseURL + this.resourcePath;
            } else if (this.resourceURL) {
                return this.resourceURL;
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