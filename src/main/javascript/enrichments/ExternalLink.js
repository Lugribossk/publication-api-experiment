define(["jquery", "enrichments/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        function ExternalLink(data) {
            Enrichment.call(this, data);
        }
        ExternalLink.prototype = new Enrichment();

        ExternalLink.prototype.createDomElement = function () {
            // As an alternative we could ignore the superclass method and make this one an actual link instead.
            return Enrichment.prototype.createDomElement.call(this, this.url + ", " + this.target)
                .addClass("ExternalLink");
        };

        return ExternalLink;
    });