define(["jquery",
        "enrichment/BuyTheLookWidget",
        "enrichment/CustomLink",
        "enrichment/Enrichment",
        "enrichment/ExternalLink",
        "enrichment/InternalLink",
        "enrichment/ProductDetailsWidget",
        "enrichment/ProductLink",
        "enrichment/VideoEnrichment",
        "util/Logger",
        "util/Browser",
        "view/SimpleShapeView"],
    function ($, BuyTheLookWidget, CustomLink, Enrichment, ExternalLink, InternalLink, ProductDetailsWidget, ProductLink, VideoEnrichment, Logger, Browser, SimpleShapeView) {
        "use strict";
        var log = new Logger("SimpleEnrichmentView");

        /**
         * Simple views for all the enrichment classes.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function SimpleEnrichmentView() {}

        /**
         * @inheritDoc
         */
        BuyTheLookWidget.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "BuyTheLookWidget", null, this.getProducts());
        };

        /**
         * @inheritDoc
         */
        CustomLink.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "CustomLink", JSON.stringify(this.value), this.value);
        };

        /**
         * Create a DOM element that visualizes this enrichment.
         *
         * @param {String} cssClass CSS class to add to the element.
         * @param {*|Promise} [label] Label to annotate the element with, optional. If a Promise, uses the promised value.
         * @param {*|Promise} [clickLog] Additional information to log when the element is clicked, optional. If a Promise, uses the promised value.
         * @return {jQuery} The element
         */
        Enrichment.prototype.createDomElement = function (cssClass, label, clickLog) {
            var scope = this,
                element = this.getShape().createDomElement()
                    .addClass("Enrichment")
                    .addClass(cssClass); // If only there was a reliable way to get the current object's class name so we could use that directly.

            if (label) {
                $.when(label)
                    .done(function (value) {
                        $("<span/>")
                            .addClass("Label")
                            .text(value)
                            .appendTo(element);
                    });
            }

            element.on("click", function () {
                log.info(scope);
                if (clickLog) {
                    log.info(clickLog);
                }
            });

            return element;
        };

        /**
         * @inheritDoc
         */
        ExternalLink.prototype.createDomElement = function () {
            var scope = this,
                element = Enrichment.prototype.createDomElement.call(this, "ExternalLink", this.url + ", " + this.target);

            element.on("dblclick", function () {
                Browser.getWindow().open(scope.url, scope.target);
            });

            return element;
        };

        /**
         * @inheritDoc
         */
        InternalLink.prototype.createDomElement = function () {
            var scope = this,
                element = Enrichment.prototype.createDomElement.call(this, "InternalLink", "Page " + this.targetPageNumber);

            element.on("dblclick", function () {
                // Since the pages are stacked vertically on top of each other, we can jump to to a particular page by scrolling up/down the right amount.
                $("body").animate({
                    scrollTop: $("#page" + scope.targetPageNumber).offset().top
                }, 500);
            });

            return element;
        };

        /**
         * @inheritDoc
         */
        ProductDetailsWidget.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "ProductDetailsWidget", null, this.getProduct());
        };

        /**
         * @inheritDoc
         */
        ProductLink.prototype.createDomElement = function () {
            var productIdPromise = this.getProduct()
                .then(function (product) {
                    return product.product_id;
                });
            var cssClass = "ProductLink " + (this.usesProductDatabase ? "DatabaseProduct" : "ManualProduct");
            var element = Enrichment.prototype.createDomElement.call(this, cssClass, productIdPromise, this.getProduct());

            // TODO this applies to internal and external links as well.
            if (this.getMediaRepresentations().length > 0) {
                // The media representation is a background image for the link.
                element.css({
                    "background-image": "url(" + this.getMediaRepresentations()[0].getBinaryURL() + ")"
                });
            }

            return element;
        };

        /**
         * @inheritDoc
         */
        VideoEnrichment.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "VideoEnrichment");
        };
    });