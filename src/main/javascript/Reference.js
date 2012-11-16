define(["jquery"],
    function ($) {
        "use strict";

        function Reference(data) {
            $.extend(this, data);
        }

        var bundleCache = {};
        function getBundle(scope) {
            return bundleCache[scope.path] && bundleCache[scope.path][scope.part];
        }

        function putBundle(scope, bundle) {
            bundleCache[scope.path] = bundle;
        }

        function getStandalonePathReference(scope) {
            $.ajax({
                url: Reference.baseURL + scope.path
            });
        }

        function getStandaloneURLReference(url) {
            $.ajax({
                url: url
            });
        }

        function getBundleReference(scope) {
            var cachedBundle = getBundle(scope);
            if (cachedBundle) {
                return cachedBundle;
            } else {
                return $.ajax({
                    url: scope.baseURL + scope.path
                })
                    .then(function (bundle) {
                        putBundle(scope, bundle);
                        return getBundle(scope);
                    });
            }
        }

        Reference.prototype.get = function () {
            if (this.resourcePath) {
                return getStandalonePathReference(this);
            } else if (this.resourceURL) {
                return getStandaloneURLReference(this);
            } else if (this.bundlePath) {
                return getBundleReference(this);
            } else {
                return new $.Deferred().reject();
            }
        };

        Reference.baseURL = null;

        return Reference;
    });