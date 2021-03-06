define(["publication/PageRepresentation", "internal/Reference", "enrichment/EnrichmentParser", "util/Promise", "util/Deferred"],
    function (PageRepresentation, Reference, EnrichmentParser, Promise, Deferred) {
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
             * The page number. The first page is page <b>1</b>, not 0.
             * @type {Number}
             */
            this.pageNumber = data.pageNumber;
            /**
             * The page label.
             * @type {String}
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
                .filter(function (representation) {
                    // We can only use images and not SWF files.
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
                return new Reference(enrichmentList).getEachWith(new EnrichmentParser().construct);
            });
            // TODO combine the lists into one before returning them
            return Deferred.when.apply(this, references);
        };

        /**
         * Get all the products on this page.
         *
         * @returns {Promise} A promise for the list of {@link Product}s.
         */
        Page.prototype.getProducts = function () {
            return this.getEnrichments()
                .then(function (enrichments) {
                    var products = [];

                    enrichments.forEach(function (enrichment) {
                        if (enrichment.getProduct) {
                            products.push(enrichment.getProduct());
                        }
                        // TODO BTL widgets?
                    });

                    return Promise.all(products);
                });
        };

        /**
         * Get the specified product.
         * Only works for products that are in the enrichments on this page.
         *
         * @param {String} productID The product ID.
         * @return {Promise} A promise for the {@link Product}.
         */
        Page.prototype.getProduct = function (productID) {
            return this.getProducts()
                .then(function (products) {
                    // See if one of them matches the specified ID.
                    var foundProduct = null;
                    products.forEach(function (product) {
                        if (product.product_id === productID) {
                            foundProduct = product;
                        }
                    });

                    if (!foundProduct) {
                        return new Promise.rejected();
                    }
                    return foundProduct;
                });
        };

        return Page;
    });