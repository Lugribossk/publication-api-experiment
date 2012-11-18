define(["jquery", "internal/Reference", "Page"],
    function ($, Reference, Page) {
        "use strict";

        /**
         * A Zmags publication.
         *
         * Note that this constructor is private and will not create a useful object.
         * Instead use {@link PublicationAPI#getPublication()}.
         *
         * @param {String} id The publication ID
         *
         * @class Publication
         * @author Bo Gotthardt
         */
        function Publication(id) {
            this.id = id;
        }

        /**
         * Get the specified page.
         *
         * @param {Number} pageNumber The page number, starts at <b>1</b>.
         * @return {$.Deferred} A deferred that resolves with the page.
         */
        Publication.prototype.getPage = function (pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.numberOfPages) {
                // The pageDescriptors array seems to have the pages in sorted order.
                return new Reference(this.pageDescriptors[pageNumber - 1]).getAs(Page);
            } else {
                return new $.Deferred().reject();
            }
        };

        /**
         * Get all the publication's pages, in ascending order.
         *
         * @return {$.Deferred} A deferred that resolves with the pages.
         */
        Publication.prototype.getPages = function () {
            var deferreds = $.map(this.pageDescriptors, function (descriptor) {
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
         * @return {$.Deferred} A deferred that resolves with the page number.
         */
        Publication.prototype.getPageNumberWithProduct = function (productID) {
            if (this.productIndex) {
                // productIndex actually points to a "part index".
                return new Reference(this.productIndex).get()
                    .then(function (partIndex) {
                        // We then use this to look up with part the product is in.
                        var correctPart = null;
                        $.each(partIndex, function (i, part) {
                            if (productID >= part.from && productID <= part.to) {
                                correctPart = part;
                            }
                        });
                        if (!correctPart) {
                            // The product ID does not exist in the publication.
                            return new $.Deferred().reject();
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
                            return new $.Deferred().reject();
                        }
                    });
            } else {
                return new $.Deferred().reject();
            }
        };

        /**
         * Get the specified product.
         * Only works for products that are actually in the publication.
         *
         * @param {String} productID The product ID.
         * @return {$.Deferred} A deferred that resolves with the product.
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