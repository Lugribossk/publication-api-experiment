define(["jquery", "enrichment/Enrichment", "util/Browser"],
    function ($, Enrichment, Browser) {
        "use strict";

        /**
         * A link to an external website.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function ExternalLink(data) {
            Enrichment.call(this, data);
            /**
             * The window to open the URL in.
             * @type {String}
             */
            this.target = data.target;
            /**
             * The external link URL.
             * @type {String}
             */
            this.url = data.url;
        }
        ExternalLink.prototype = Object.create(Enrichment.prototype);

        ExternalLink.prototype.createDomElement = function () {
            var scope = this,
                element = Enrichment.prototype.createDomElement.call(this, "ExternalLink", this.url + ", " + this.target);

            element.on("dblclick", function () {
                Browser.getWindow().open(scope.url, scope.target);
            });

            return element;
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        ExternalLink.TYPE =  "externalLink";

        return ExternalLink;
    });