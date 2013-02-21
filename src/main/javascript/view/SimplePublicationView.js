define(["jquery", "publication/Publication", "publication/Page", "publication/PageRepresentation", "util/Logger", "view/SimpleEnrichmentView"],
    function ($, Publication, Page, PageRepresentation, Logger, SimpleEnrichmentView) {
        "use strict";
        var log = new Logger("SimplePublicationView");

        /**
         * Simple views for the publication data classes.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function SimplePublicationView() {}

        /**
         * Create a DOM element that visualizes this publication.
         *
         * @param {Object} pageBounds
         * @return {jQuery} The element
         */
        Publication.prototype.createDomElement = function (pageBounds) {
            var i,
                scope = this,
                publicationElement = $("<div/>")
                    .addClass("Publication");

            // Extra function so that pageElement is scoped inside the loop = recreated rather than reassigned on each iteration.
            function createPageElement(pageNumber) {
                // Create and insert a placeholder element for the page immediately.
                var pageElement = $("<div/>").appendTo(publicationElement);

                // And then have the page promise insert the real page element into it, so that pages start rendering as
                // soon as they are done, rather than wait for us to retrieve all the pages and then loop through them.
                scope.getPage(pageNumber)
                    .done(function (page) {
                        page.createDomElement(pageBounds, scope.pageAspectRatio).appendTo(pageElement);
                    });
            }

            for (i = 1; i <= this.numberOfPages; i++) {
                createPageElement(i);
            }

            return publicationElement;
        };

        /**
         * Reduce the size of one of the dimensions of the specified bounding box so that it has the specified aspect ratio.
         *
         * @private
         * @static
         *
         * @param {Object} bounds The bounding box
         * @param {Number} ratio The aspect ratio
         * @return {{width: Number, height: Number}}
         */
        function reduceToAspectRatio(bounds, ratio) {
            var width, height;
            if (ratio < 1) {
                height = bounds.height;
                width = Math.round(height * ratio);
            } else if (ratio > 1) {
                width = bounds.width;
                height = Math.round(width / ratio);
            } else {
                width = Math.min(bounds.height, bounds.width);
                height = Math.min(bounds.height, bounds.width);
            }

            return {
                width: width,
                height: height
            };
        }

        /**
         * Create a DOM element that visualises this page.
         *
         * @param {Object} pageBounds The maximum size of the page.
         * @param {Number} [aspectRatio] The aspect ratio the page should be. Optional
         * @param {Boolean} [ignoreEnrichments=false] Whether to create a simple element that only shows the page, but not enrichments.
         * @return {jQuery} The element
         */
        Page.prototype.createDomElement = function (pageBounds, aspectRatio, ignoreEnrichments) {
            if (!aspectRatio) {
                var largestRep = this.getRepresentations()[this._pageRepresentationDescriptors.length - 1];
                aspectRatio = largestRep.width / largestRep.height;
            }
            var pageSize = reduceToAspectRatio(pageBounds, aspectRatio);

            var page = $("<div/>")
                .attr("id", "page" + this.pageNumber)
                .addClass("Page")
                .css({
                    height: pageSize.height,
                    width: pageSize.width,
                    "background-image": "url(" + this.getClosestRepresentation(pageSize).getImageURL() + ")"
                });

            if (!ignoreEnrichments) {
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
            }

            return page;
        };

        /**
         * Create a DOM element that visualizes this page representation.
         *
         * @return {jQuery} The element
         */
        PageRepresentation.prototype.createDomElement = function () {
            if (this.type !== PageRepresentation.Type.IMAGE) {
                log.error("Trying to create DOM element for non-image page representation.", this);
            }
            return $("<img/>", {
                src: this.getImageURL()
            }).addClass("PageRepresentation");
        };
    });