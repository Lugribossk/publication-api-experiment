define(["jquery", "enrichments/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        function InternalLink(data) {
            Enrichment.call(this, data);
            /**
             * {Number} The page number linked to.
             */
            this.targetPageNumber = data.targetPageNumber;
        }
        InternalLink.prototype = new Enrichment();

        InternalLink.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "Page " + this.targetPageNumber)
                .addClass("InternalLink");
        };

        InternalLink.TYPE = "internalLink";

        return InternalLink;
    });