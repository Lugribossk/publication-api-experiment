define(["jquery", "PageRepresentation", "Reference", "enrichments/Enrichment"],
    function ($, PageRepresentation, Reference, Enrichment) {
        "use strict";

        /**
         * A page in a publication.
         *
         * @param {Object} data The raw object to convert to a Page object.
         *
         * @class Page
         * @author Bo Gotthardt
         */
        function Page(data) {
            // TODO Validation?
            $.extend(this, data);
        }

        /**
         * Get all of this page's page representations.
         *
         * @return {PageRepresentation[]}
         */
        Page.prototype.getRepresentations = function () {
            // TODO cache this
            return $.map(this.pageRepresentationDescriptors, function (descriptor) {
                return new PageRepresentation(descriptor);
            });
        };

        /**
         * Get the page representation "closest" to the specified size.
         * TODO details on "closest"
         *
         * @param size
         * @return {PageRepresentation}
         */
        Page.prototype.getClosestRepresentation = function (size) {
            var bestRep = null;
            $.each(this.getRepresentations(), function (index, representation) {
                if ((representation.type === "image" &&
                     representation.width >= size.width &&
                     representation.width < bestRep.width)
                        || !bestRep) {
                    bestRep = representation;
                }
            });
            return bestRep;
        };

        /**
         * Get all the enrichments on this page.
         *
         * @return {$.Deferred} A deferred that resolves with the list of Enrichment objects
         */
        Page.prototype.getEnrichments = function () {
            var references = $.map(this.pageEnrichments, function (enrichment) {
                return new Reference(enrichment).get()//.getAs(Enrichment);
            });
            return $.when.apply(this, references);
        };

        return Page;
    });