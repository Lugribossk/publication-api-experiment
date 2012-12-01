define(["jquery", "publication/PageRepresentation", "internal/Reference", "enrichment/EnrichmentParser", "util/Promise"],
    function ($, PageRepresentation, Reference, EnrichmentParser, Promise) {
        "use strict";

        /**
         * A page in a publication.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw object to convert to a Page object.
         */
        function Page(data) {
            /**
             * {Number} The page number. The first page is page <b>1</b>, not 0.
             */
            this.pageNumber = data.pageNumber;
            /**
             * {String} The page label.
             */
            this.pageLabel = data.pageLabel;

            this._pageRepresentationDescriptors = data.pageRepresentationDescriptors;
            this._pageEnrichments = data.pageEnrichments;
        }

        /**
         * Get all of this page's page representations, in ascending order by size.
         *
         * @return {PageRepresentation[]}
         */
        Page.prototype.getRepresentations = function () {
            return this._pageRepresentationDescriptors.map(function (descriptor) {
                return new PageRepresentation(descriptor);
            }).sort(function (a, b) {
                return a.width - b.width;
            });
        };

        /**
         * Get the page representation "closest" to the specified size.
         * TODO details on "closest"
         *
         * @param {Object} size
         * @return {PageRepresentation}
         */
        Page.prototype.getClosestRepresentation = function (size) {
            var bestRep = null;

            this.getRepresentations()
                .filter(function(representation) {
                    // We can't use SWF representations, so filter them out.
                    return representation.type === PageRepresentation.Type.IMAGE;
                })
                .some(function (representation) {
                    // Find the first representation that is larger than the specified size.
                    bestRep = representation;
                    return representation.width >= size.width;
                });

            return bestRep;
        };

        /**
         * Get all the enrichments on this page.
         *
         * @return {Promise} A promise for the list of {@link Enrichment}s.
         */
        Page.prototype.getEnrichments = function () {
            // If there are no enrichments then pageEnrichments is undefined rather than empty.
            if (!this._pageEnrichments) {
                return Promise.resolved([]);
            }

            var references = this._pageEnrichments.map(function (enrichmentList) {
                return new Reference(enrichmentList).getEachWith(EnrichmentParser.construct);
            });
            // TODO combine the lists into one before returning them
            return $.when.apply(this, references);
        };

        /**
         * Get the specified product.
         * Only works for products that are in the enrichments on this page.
         *
         * @param {String} productID The product ID.
         * @return {Promise} A promise for the {@link Product}.
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
                        return new Promise.rejected();
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
                    enrichments.forEach(function (enrichment) {
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