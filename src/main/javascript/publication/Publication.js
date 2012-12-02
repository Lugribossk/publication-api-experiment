define(["jquery", "internal/Reference", "publication/Page", "util/Promise", "util/Logger"],
    function ($, Reference, Page, Promise, Logger) {
        "use strict";
        var log = new Logger("Publication");

        /**
         * A Zmags publication.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * Note that this constructor is only useful with internal data from {@link PublicationAPI}.
         * Instead use {@link PublicationAPI#getPublication}.
         *
         * @param {String} id The publication ID
         * @param {Object} info The publication info
         * @param {Object} descriptor The publication descriptor
         */
        function Publication(id, info, descriptor) {
            /**
             * The ID of the publication.
             * @type {String}
             */
            this.id = id;
            /**
             * The version number.
             * @type {Number}
             */
            this.version = info.version;
            /**
             * Whether the publication has expired.
             * @type {Boolean}
             */
            this.expired = info.expired;
            /**
             * Whether the publication is activated.
             * @type {Boolean}
             */
            this.activated = info.activated;
            /**
             * The name of the publication.
             * @type {String}
             */
            this.name = descriptor.name;
            /**
             * The number of pages in the publication.
             * @type {Number}
             */
            this.numberOfPages = descriptor.numberOfPages;
            /**
             * The aspect ratio of the pages in the publication, as width / height.
             * @type {Number}
             */
            this.pageAspectRatio = descriptor.pageAspectRatio;
            /**
             * Whether the first page is a cover page.
             * For publications where two pages are displayed in a magazine-like spread, this determines if
             * the first page stands alone on the right, rather than being together with page 2.
             * @type {Boolean}
             */
            this.firstPageIsCoverPage = descriptor.firstPageIsCoverPage;

            this._pageDescriptors = descriptor.pageDescriptors;
            this._productIndex = descriptor.productIndex;
        }

        /**
         * Get the specified page.
         *
         * @param {Number} pageNumber The page number, starts at <b>1</b>.
         * @return {Promise} A promise for the {@link Page}.
         */
        Publication.prototype.getPage = function (pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.numberOfPages) {
                // The pageDescriptors list has the pages in sorted order.
                return new Reference(this._pageDescriptors[pageNumber - 1]).getAs(Page);
            } else {
                log.error("Page number", pageNumber, "out of range.");
                return Promise.rejected();
            }
        };

        /**
         * Get all the publication's pages, in ascending order.
         *
         * @return {Promise} A promise for the list of {@link Page}s.
         */
        Publication.prototype.getPages = function () {
            var deferreds = this._pageDescriptors.map(function (descriptor) {
                return new Reference(descriptor).getAs(Page);
            });

            return Promise.all(deferreds);
        };

        /**
         * Get the page number of the first page where the product with the specified ID is located.
         *
         * @param {String} productID The product ID.
         * @return {Promise} A promise for the page number.
         */
        Publication.prototype.getPageNumberWithProduct = function (productID) {
            if (this._productIndex) {
                // productIndex actually points to a "part index".
                return new Reference(this._productIndex).get()
                    .then(function (partIndex) {
                        // We then use this to look up which part the product is in.
                        var correctPart = null;
                        $.each(partIndex, function (i, part) {
                            if (productID >= part.from && productID <= part.to) {
                                correctPart = part;
                                return false;
                            } else {
                                return true;
                            }
                        });
                        if (!correctPart) {
                            // The product ID does not exist in the publication.
                            return Promise.rejected();
                        }

                        // Which has a reference pointing to an "index part".
                        return new Reference(correctPart.indexPart).get();
                    })
                    .then(function (indexPart) {
                        // Where we can finally look up the product ID.
                        var pageNumber = indexPart[productID];
                        if (pageNumber) {
                            return pageNumber;
                        } else {
                            // It should have been found since the index said it was on that page.
                            log.warn("Inconsistent product index behavior for product ID", productID);
                            return Promise.rejected();
                        }
                    });
            } else {
                return Promise.rejected();
            }
        };

        /**
         * Get the specified product.
         * Only works for products that are actually in the publication.
         *
         * @param {String} productID The product ID.
         * @return {Promise} A promise for the {@link Product}.
         */
        Publication.prototype.getProduct = function (productID) {
            return this.getPageNumberWithProduct(productID)
                .then(this.getPage)
                .then(function (page) {
                    return page.getProduct(productID);
                });
        };

        return Publication;
    });