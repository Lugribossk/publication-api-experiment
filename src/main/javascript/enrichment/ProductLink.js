define(["jquery", "internal/Reference", "publication/Product", "enrichment/Enrichment", "util/Promise", "util/Logger"],
    function ($, Reference, Product, Enrichment, Promise, Logger) {
        "use strict";
        var log = new Logger("ProductLink");

        /**
         * A product link, either with manually entered data or from the product database.
         *
         * @param {Object} data The raw API data.
         *
         * @class ProductLink
         * @extends Enrichment
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
        ProductLink.prototype = Object.create(Enrichment.prototype);

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
                return Promise.resolved(new Product({
                    properties: {
                        product_id: this._manualProduct.productID,
                        name: this._manualProduct.productName,
                        description: this._manualProduct.productDescription,
                        price: this._manualProduct.productPrice
                    }
                }));
            }
        };

        ProductLink.prototype.createDomElement = function () {
            var element = Enrichment.prototype.createDomElement.call(this)
                    .addClass("ProductLink " + (this.usesProductDatabase ? "DatabaseProduct" : "ManualProduct"));

            this.getProduct()
                .done(function (product) {
                    $("<span/>")
                        .addClass("Label")
                        .text(product.product_id)
                        .appendTo(element);

                    element.on("click", function () {
                        log.info(product);
                    });
                });

            return element;
        };

        // Extra property that identifies this type of enrichment as having product data associated with it.
        ProductLink.prototype.hasProduct = true;

        ProductLink.TYPE = "productLink";

        return ProductLink;
    });