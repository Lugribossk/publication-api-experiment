define(["jquery", "enrichments/ProductLink", "enrichments/Enrichment", "enrichments/ExternalLink", "enrichments/InternalLink", "enrichments/CustomLink"],
    function ($, ProductLink, Enrichment, ExternalLink, InternalLink, CustomLink) {
        "use strict";

        function EnrichmentParser() {
        }

        EnrichmentParser.construct = function (data) {
            var type = data.type;
            if (type === "productLink") {
                return new ProductLink(data);
            } else if (type === "externalLink") {
                return new ExternalLink(data);
            } else if (type === "internalLink") {
                return new InternalLink(data);
            } else if (type === "customLink") {
                return new CustomLink(data);
            } else {
                // TODO
                console.warn("Unimplemented enrichment type", type);
                return new Enrichment(data);
            }
        };

        return EnrichmentParser;
    });