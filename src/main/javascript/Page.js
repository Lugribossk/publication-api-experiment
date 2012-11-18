define(["jquery", "PageRepresentation", "internal/Reference", "enrichments/EnrichmentParser"],
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
         * Get all of this page's page representations, in ascending order by size.
         *
         * @return {PageRepresentation[]}
         */
        Page.prototype.getRepresentations = function () {
            return $.map(this.pageRepresentationDescriptors, function (descriptor) {
                return new PageRepresentation(descriptor);
            }).sort(function (a, b) {
                return a.width - b.width;
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
                    bestRep = representation;
                    if (representation.width >= size.width) {
                        return false;
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
            // TODO combine the lists into one before returning them
            return $.when.apply(this, references);
        };

        /**
         * Get the specified product.
         * Only works for products that are in enrichments on this page.
         *
         * @param {String} productID The product ID.
         * @return {$.Deferred} A deferred that resolves with the product.
         */
        Page.prototype.getProduct = function (productID) {
            // Get all the enrichments on the page.
            return this.getEnrichments()
                .then(function (enrichments) {
                    // Then get the products for those of the enrichments that have them.
                    var deferreds = $.map(enrichments, function (enrichment) {
                        if (enrichment.hasProduct) {
                            return enrichment.getProduct();
                        }
                    });

                    return $.when.apply(this, deferreds);
                })
                .then(function () {
                    // Then see if one of them matches the specified ID.
                    var foundProduct = null;
                    $.each(arguments, function (i, product) {
                        if (product.product_id === productID) {
                            foundProduct = product;
                            return false;
                        }
                    });

                    if (foundProduct) {
                        return foundProduct;
                    } else {
                        return new $.Deferred().reject();
                    }
                });
        };

        Page.prototype.createDomElement = function (size) {
            var rep = this.getClosestRepresentation(size);
            var page = $("<div/>")
                .addClass("Page")
                .height(rep.height)
                .width(rep.width)
                .append(rep.createDomElement());

            this.getEnrichments()
                .done(function (enrichments) {
                    $.each(enrichments, function (index, enrichment) {
                        enrichment.createDomElement().appendTo(page);
                    });
                });

            $("<span/>")
                .addClass("Label")
                .text(this.pageLabel)
                .appendTo(page);

            return page;
        };

        return Page;
    });