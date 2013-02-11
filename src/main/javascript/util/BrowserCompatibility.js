define(["jquery", "lib/XDomain", "lib/es5-shim.min", "lib/es5-sham.min"],
    function ($) {
        "use strict";

        /**
         * Utility module that ensures all libraries needed for IE compatibility have been loaded.
         *
         * <a href="https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest">XDomainRequest</a> is needed for non-JSONP cross-domain requests.
         * <a href="https://github.com/kriskowal/es5-shim">es5-shim</a> is needed for a bunch of ES5 features.
         * <a href="https://github.com/kriskowal/es5-shim">es5-sham</a> is needed for Object.create().
         *
         * @author Bo Gotthardt
         */

        $.ajaxSetup({
            dataType: "json",
            timeout: 20000
        });
    });