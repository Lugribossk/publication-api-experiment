define(["jquery", "PageRepresentation", "Reference", "enrichments/EnrichmentParser"],
    function ($, PageRepresentation, Reference, EnrichmentParser) {
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
                if (representation.type === "image") {
                    if (!bestRep) {
                        bestRep = representation;
                    } else if (representation.width <= size.width &&
                            representation.width > bestRep.width) {
                        bestRep = representation;
                    } else if (representation.width >= size.width &&
                            representation.width < bestRep.width) {
                        bestRep = representation;
                    }
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
            // If there are no enrichments then pageEnrichments is undefined rather than empty.
            if (!this.pageEnrichments) {
                return new $.Deferred().resolve([]);
            }

            var references = $.map(this.pageEnrichments, function (enrichmentList) {
                return new Reference(enrichmentList).getEachWith(EnrichmentParser);
            });
            // TODO combine the lists into one before returning them?
            return $.when.apply(this, references);
        };

        Page.prototype.createDomElement = function (size) {
            var rep = this.getClosestRepresentation(size);
            var element = $("<div/>")
                .addClass("Page")
                .height(rep.height)
                .width(rep.width)
                .append(rep.createDomElement());

            this.getEnrichments()
                .done(function (enrichments) {
                    $.each(enrichments, function (index, enrichment) {
                        enrichment.createDomElement().appendTo(element);
                    });
                });

            return element;
        };

        return Page;
    });