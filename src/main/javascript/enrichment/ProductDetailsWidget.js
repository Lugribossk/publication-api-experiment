define(["jquery", "enrichment/Enrichment", "internal/Reference", "publication/Product", "util/Logger"],
    function ($, Enrichment, Reference, Product, Logger) {
        "use strict";
        var log = new Logger("ProductDetailsWidget");

        /**
         * A product details widget. Similar to a product link, but with more advanced settings.
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
            var element = Enrichment.prototype.createDomElement.call(this)
                .addClass("ProductDetailsWidget");

            element.on("click", function () {
                this.getProduct()
                    .done(function (product) {
                        log.info(product);
                    });
            }.bind(this));

            return element;
        };

        ProductDetailsWidget.prototype.hasProduct = true;

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        ProductDetailsWidget.TYPE = "productDetailsWidget";

        return ProductDetailsWidget;
    });