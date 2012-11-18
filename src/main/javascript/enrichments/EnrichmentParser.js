define(["jquery", "enrichments/ProductLink", "enrichments/ExternalLink", "enrichments/InternalLink", "enrichments/CustomLink", "enrichments/ProductDetailsWidget", "enrichments/BuyTheLookWidget"],
    function ($, ProductLink, ExternalLink, InternalLink, CustomLink, ProductDetailsWidget, BuyTheLookWidget) {
        "use strict";

        /**
         * Utility class for converting untyped objects into Enrichment subclass instances.
         *
         * @class EnrichmentParser
         * @author Bo Gotthardt
         */
        function EnrichmentParser() {}

        /**
         * Construct an appropriately subclassed Enrichment instance from the specified data.
         *
         * @param {Object} data
         * @return {Enrichment}
         */
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
            } else if (type === ProductDetailsWidget.TYPE) {
                return new ProductDetailsWidget(data);
            } else if (type === BuyTheLookWidget.TYPE) {
                return new BuyTheLookWidget(data);
            } else {
                console.warn("Unknown enrichment type", type);
                return null;
            }
        };

        return EnrichmentParser;
    });