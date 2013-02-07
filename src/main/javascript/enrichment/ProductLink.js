define(["jquery", "internal/Reference", "publication/Product", "enrichment/Enrichment", "util/Promise", "util/Logger", "publication/MediaRepresentation"],
    function ($, Reference, Product, Enrichment, Promise, Logger, MediaRepresentation) {
        "use strict";
        var log = new Logger("ProductLink");

        /**
         * A product link, either with manually entered data or from the product database.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function ProductLink(data) {
            Enrichment.call(this, data);
            /**
             * Whether this link's data comes from the product database, rather than being manually entered.
             * @type {Boolean}
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
            }
            // Mimic the format for a database product so we can reuse the constructor logic.
            return Promise.resolved(new Product({
                properties: {
                    product_id: this._manualProduct.productID,
                    name: this._manualProduct.productName,
                    description: this._manualProduct.productDescription,
                    price: this._manualProduct.productPrice
                }
            }));
        };

        ProductLink.prototype.createDomElement = function () {
            var productIdPromise = this.getProduct()
                .then(function (product) {
                    return product.product_id;
                });

            var element = Enrichment.prototype.createDomElement.call(this, productIdPromise, this.getProduct())
                    .addClass("ProductLink " + (this.usesProductDatabase ? "DatabaseProduct" : "ManualProduct"));

            if (this.getMediaRepresentations().length > 0) {
                // The media representation is a background image for the link.
                element.css({
                    "background-image": "url(" + this.getMediaRepresentations()[0].getBinaryURL() + ")"
                });
            }

            return element;
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        ProductLink.TYPE = "productLink";

        return ProductLink;
    });