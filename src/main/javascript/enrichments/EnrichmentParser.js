define(["jquery", "enrichments/ProductLink", "enrichments/Enrichment", "enrichments/ExternalLink", "enrichments/InternalLink", "enrichments/CustomLink"],
    function ($, ProductLink, Enrichment, ExternalLink, InternalLink, CustomLink) {
        "use strict";

        function EnrichmentParser() {}

        EnrichmentParser.construct = function (data) {
            var type = data.type;
            if (type === ProductLink.TYPE) {
                return new ProductLink(data);
            } else if (type === ExternalLink.TYPE) {
                return new ExternalLink(data);
            } else if (type === InternalLink.TYPE) {
                return new InternalLink(data);
            } else if (type === CustomLink.TYPE) {
                return new CustomLink(data);
            } else {
                // TODO widgets
                console.warn("Unimplemented enrichment type", type);
                return new Enrichment(data);
            }
        };

        return EnrichmentParser;
    });