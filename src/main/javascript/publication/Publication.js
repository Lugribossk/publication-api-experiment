define(["jquery", "internal/Reference", "publication/Page", "util/Promise"],
    function ($, Reference, Page, Promise) {
        "use strict";

        /**
         * A Zmags publication.
         *
         * Note that this constructor is only useful with internal data from {@link PublicationAPI}.
         * Instead use {@link PublicationAPI#getPublication()}.
         *
         * @param {String} id The publication ID
         * @param {Object} info
         * @param {Object} descriptor
         *
         * @class Publication
         * @author Bo Gotthardt
         */
        function Publication(id, info, descriptor) {
            this.id = id;
            /**
             * {Number} The version number.
             */
            this.version = info.version;
            /**
             * {Boolean} Whether the publication has expired.
             */
            this.expired = info.expired;
            /**
             * {Boolean} Whether the publication is activated.
             */
            this.activated = info.activated;
            /**
             * {String} The name of the publication.
             */
            this.name = descriptor.name;
            /**
             * {Number} The number of pages in the publication.
             */
            this.numberOfPages = descriptor.numberOfPages;
            /**
             * {Number} The aspect ratio of the pages in the publication, as width / height.
             */
            this.pageAspectRatio = descriptor.pageAspectRatio;
            /**
             * {Boolean} Whether the first page is a cover page.
             * For publications where two pages are displayed in a magazine-like spread, this determines if
             * the first page stands alone on the right, rather than being together with page 2.
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
                // The pageDescriptors array seems to have the pages in sorted order.
                return new Reference(this._pageDescriptors[pageNumber - 1]).getAs(Page);
            } else {
                return Promise.rejected();
            }
        };

        /**
         * Get all the publication's pages, in ascending order.
         *
         * @return {Promise} A promise for the list of {@link Page}s.
         */
        Publication.prototype.getPages = function () {
            var deferreds = $.map(this._pageDescriptors, function (descriptor) {
                return new Reference(descriptor).getAs(Page);
            });

            return $.when.apply(this, deferreds)
                .then(function () {
                    // We get each page as an individual argument, but would rather return them as one array.
                    return $.makeArray(arguments);
                });
        };

        /**
         * Get the page number of the first page where the product with the specified ID is located.
         *
         * @param {String} productID The product ID.
         * @return {Promise} A promise for the page number as a {@link Number}.
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
                            console.warn("Inconsistent product index behavior for product ID", productID);
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