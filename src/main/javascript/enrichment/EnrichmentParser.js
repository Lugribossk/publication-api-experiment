define(["jquery", "enrichment/ProductLink", "enrichment/ExternalLink", "enrichment/InternalLink", "enrichment/CustomLink", "enrichment/ProductDetailsWidget", "enrichment/BuyTheLookWidget", "enrichment/Video", "util/Logger"],
    function ($, ProductLink, ExternalLink, InternalLink, CustomLink, ProductDetailsWidget, BuyTheLookWidget, Video, Logger) {
        "use strict";
        var log = new Logger("EnrichmentParser");

        /**
         * Utility class for converting untyped objects into Enrichment subclass instances.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function EnrichmentParser() {}

        /**
         * Construct an appropriately subclassed Enrichment instance from the specified data.
         *
         * @param {Object} data The raw API data.
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
            } else if (type === Video.TYPE) {
                return new Video(data);
            } else {
                log.error("Unknown enrichment type", type);
                return null;
            }
        };

        return EnrichmentParser;
    });