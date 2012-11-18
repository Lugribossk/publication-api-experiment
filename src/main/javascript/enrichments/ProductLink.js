define(["jquery", "internal/Reference", "Product", "enrichments/Enrichment"],
    function ($, Reference, Product, Enrichment) {
        "use strict";

        /**
         * A product link, either with manually entered data or from the product database.
         *
         * @param {Object} data
         *
         * @class ProductLink
         * @author Bo Gotthardt
         */
        function ProductLink(data) {
            Enrichment.call(this, data);
            /**
             * {Boolean} Whether this link's data comes from the product database, rather than being manually entered.
             */
            this.usesProductDatabase = data.usesProductDatabase;

            this._productDescriptor = data.productDescriptor;
            this._manualProduct = data.manualProduct;
        }
        ProductLink.prototype = new Enrichment();

        /**
         * Get the product this link points to.
         *
         * @return {Promise} A promise for the {@link Product}.
         */
        ProductLink.prototype.getProduct = function () {
            if (this.usesProductDatabase) {
                // productDescriptor seems to be a reference and not an object.
                return new Reference(this._productDescriptor).getAs(Product);
            } else {
                // Mimic the format for a database product so we can reuse the constructor logic.
                return new $.Deferred().resolve(new Product({
                    properties: this._manualProduct
                })).promise();
            }
        };

        ProductLink.prototype.createDomElement = function () {
            var scope = this,
                element = Enrichment.prototype.createDomElement.call(this)
                    .addClass("ProductLink");

            // TODO somehow avoid duplicating this from Enrichment?
            this.getProduct()
                .done(function (product) {
                    $("<span/>")
                        .addClass("Label")
                        .text(product.product_id /*+ (scope.usesProductDatabase ? " (DB)" : " (Manual)")*/)
                        .appendTo(element);
                });

            return element;
        };

        // Extra property that identifies this type of enrichment as having product data associated with it.
        ProductLink.prototype.hasProduct = true;

        ProductLink.TYPE = "productLink";

        return ProductLink;
    });