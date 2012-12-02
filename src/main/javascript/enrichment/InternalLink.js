define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         * A link that points to a page in the same publication.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function InternalLink(data) {
            Enrichment.call(this, data);
            /**
             * The page number linked to.
             * @type {Number}
             */
            this.targetPageNumber = data.targetPageNumber;
        }
        InternalLink.prototype = Object.create(Enrichment.prototype);

        InternalLink.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "Page " + this.targetPageNumber)
                .addClass("InternalLink");
        };

        InternalLink.TYPE = "internalLink";

        return InternalLink;
    });