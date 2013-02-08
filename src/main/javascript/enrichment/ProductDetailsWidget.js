define(["jquery", "enrichment/Enrichment", "internal/Reference", "publication/Product"],
    function ($, Enrichment, Reference, Product) {
        "use strict";

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

            this._productDescriptor = data.productDescriptor;
        }
        ProductDetailsWidget.prototype = Object.create(Enrichment.prototype);

        /**
         * Get the product this widget has.
         *
         * @return {Promise} A promise for the {@link Product}.
         */
        ProductDetailsWidget.prototype.getProduct = function () {
            return new Reference(this._productDescriptor).getAs(Product);
        };

        ProductDetailsWidget.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, "ProductDetailsWidget", null, this.getProduct());
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        ProductDetailsWidget.TYPE = "productDetailsWidget";

        return ProductDetailsWidget;
    });