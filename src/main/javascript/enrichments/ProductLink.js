define(["jquery", "Reference", "Product", "enrichments/Enrichment"],
    function ($, Reference, Product, Enrichment) {
        "use strict";

        /**
         * A product link, either with manually entered data or from the product database.
         *
         * @param data
         *
         * @class ProductLink
         * @author Bo Gotthardt
         */
        function ProductLink(data) {
            Enrichment.call(this, data);
        }
        ProductLink.prototype = new Enrichment();

        /**
         * Get the product this link points to.
         *
         * @return {$.Deferred} A deferred that resolves with the product.
         */
        ProductLink.prototype.getProduct = function () {
            if (this.usesProductDatabase) {
                // productDescriptor seems to be a reference and not an object.
                return new Reference(this.productDescriptor).getAs(Product);
            } else {
                // Mimic the format for a database product so we can reuse the constructor logic.
                return new $.Deferred().resolve(new Product({
                    properties: this.manualProduct
                }));
            }
        };

        ProductLink.prototype.createDomElement = function () {
            var element = Enrichment.prototype.createDomElement.call(this)
                .addClass("ProductLink");

            // TODO somehow avoid duplicating this from Enrichment?
            this.getProduct()
                .done(function (product) {
                    $("<span/>")
                        .addClass("EnrichmentLabel")
                        .text((this.usesProductDatabase ? "DB:" : "Manual:") + product.product_id)
                        .appendTo(element);
                });

            return element;
        };

        return ProductLink;
    });