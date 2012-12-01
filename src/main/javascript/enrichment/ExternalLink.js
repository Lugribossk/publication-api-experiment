define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         * A link to an external website.
         *
         * @param {Object} data The raw API data.
         *
         * @class ExternalLink
         * @extends Enrichment
         * @author Bo Gotthardt
         */
        function ExternalLink(data) {
            Enrichment.call(this, data);
            /**
             * {String} The window to open the URL in.
             */
            this.target = data.target;
            /**
             * {String} The external link URL.
             */
            this.url = data.url;
        }
        ExternalLink.prototype = Object.create(Enrichment.prototype);

        ExternalLink.prototype.createDomElement = function () {
            // As an alternative we could ignore the superclass method and make this one an actual link instead.
            return Enrichment.prototype.createDomElement.call(this, this.url + ", " + this.target)
                .addClass("ExternalLink");
        };

        ExternalLink.TYPE =  "externalLink";

        return ExternalLink;
    });