define(["jquery", "enrichments/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        function CustomLink(data) {
            Enrichment.call(this, data);
        }
        CustomLink.prototype = new Enrichment();

        CustomLink.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, this.value)
                .addClass("CustomLink");
        };

        CustomLink.TYPE = "customLink";

        return CustomLink;
    });