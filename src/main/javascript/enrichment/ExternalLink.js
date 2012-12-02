define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
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
            return Enrichment.prototype.createDomElement.call(this, this.url + ", " + this.target)
                .addClass("ExternalLink");
        };

        ExternalLink.TYPE =  "externalLink";

        return ExternalLink;
    });