define(["jquery", "enrichments/Enrichment", "internal/Reference", "Product"],
    function ($, Enrichment, Reference, Product) {
        "use strict";

        /**
         *
         * @param data
         * @class ProductDetailsWidget
         */
        function ProductDetailsWidget(data) {
            Enrichment.call(this, data);
            this.windowLocationHint = data.windowLocationHint;
            this.label = data.label;
            this.button = data.button;
            this.shapeEnabled = data.shapeEnabled;

            this._productDescriptor = data.productDescriptor;
        }
        ProductDetailsWidget.prototype = new Enrichment();

        /**
         * Get the product this widget has.
         *
         * @return {Promise} A promise for the {@link Product}.
         */
        ProductDetailsWidget.prototype.getProduct = function () {
            return new Reference(this._productDescriptor).getAs(Product);
        };

        ProductDetailsWidget.prototype.createDomElement = function () {
            // TODO Product ID label?
            return Enrichment.prototype.createDomElement.call(this)
                .addClass("ProductDetailsWidget");
        };

        ProductDetailsWidget.prototype.hasProduct = true;

        ProductDetailsWidget.TYPE = "productDetailsWidget";

        return ProductDetailsWidget;
    });