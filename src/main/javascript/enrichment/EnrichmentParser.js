define(["enrichment/ProductLink",
        "enrichment/ExternalLink",
        "enrichment/InternalLink",
        "enrichment/CustomLink",
        "enrichment/ProductDetailsWidget",
        "enrichment/BuyTheLookWidget",
        "enrichment/VideoEnrichment",
        "enrichment/IframeWidget",
        "util/Logger"],
    function (ProductLink, ExternalLink, InternalLink, CustomLink, ProductDetailsWidget, BuyTheLookWidget, VideoEnrichment, IframeWidget, Logger) {
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
        EnrichmentParser.prototype.construct = function (data) {
            switch (data.type) {
            case ProductLink.TYPE:
                return new ProductLink(data);
            case ExternalLink.TYPE:
                return new ExternalLink(data);
            case InternalLink.TYPE:
                return new InternalLink(data);
            case CustomLink.TYPE:
                return new CustomLink(data);
            case ProductDetailsWidget.TYPE:
                return new ProductDetailsWidget(data);
            case BuyTheLookWidget.TYPE:
                return new BuyTheLookWidget(data);
            case VideoEnrichment.TYPE:
                return new VideoEnrichment(data);
            case IframeWidget.TYPE:
                return new IframeWidget(data);
            default:
                log.error("Unknown enrichment type", data.type);
                return null;
            }
        };

        return EnrichmentParser;
    });