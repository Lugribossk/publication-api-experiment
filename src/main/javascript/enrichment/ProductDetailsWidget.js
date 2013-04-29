define(["enrichment/Enrichment", "internal/Reference", "publication/Product", "util/Logger", "util/Promise"],
    function (Enrichment, Reference, Product, Logger, Promise) {
        "use strict";
        var log = new Logger("ProductDetailsWidget");

        /**
         * A widget with details about a {@link Product}. Similar to a {@link ProductLink}, but with more advanced settings.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function ProductDetailsWidget(data) {
            Enrichment.call(this, data);
            this.windowLocationHint = data.windowLocationHint;
            this.label = data.label;
            this.button = data.button;
            this.shapeEnabled = data.shapeEnabled;

            this._productSourceType = data.productSourceType;
            this._externalProduct = data.externalProduct;
            this._productDescriptor = data.productDescriptor;
        }
        ProductDetailsWidget.prototype = Object.create(Enrichment.prototype);

        /**
         * Get the product this widget has.
         *
         * @return {Promise} A promise for the {@link Product}.
         */
        ProductDetailsWidget.prototype.getProduct = function () {
            if (this._productSourceType === ProductDetailsWidget.ProductSource.PRODUCT_DATABASE) {
                return new Reference(this._productDescriptor).getAs(Product);
            }
            if (this._productSourceType === ProductDetailsWidget.ProductSource.EXTERNAL) {
                return Promise.resolved(new Product({
                    properties: this._externalProduct
                }));
            }
            log.warn("Unknown product source type ", this._productSourceType);
            return null;
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        ProductDetailsWidget.TYPE = "productDetailsWidget";

        /**
         * The types of product sources.
         * @static
         * @enum ProductDetailsWidget.ProductSource
         */
        ProductDetailsWidget.ProductSource = {
            PRODUCT_DATABASE: 1,
            EXTERNAL: 2
        };

        return ProductDetailsWidget;
    });