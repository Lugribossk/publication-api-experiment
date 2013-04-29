define(["enrichment/Enrichment", "internal/Reference", "publication/Product", "util/Promise", "util/Logger"],
    function (Enrichment, Reference, Product, Promise, Logger) {
        "use strict";
        var log = new Logger("BuyTheLookWidget");

        /**
         * A "buy the look" widget. Also known as "shop the look" and several other similar names.
         * Has a list of {@link Product}s, rather than a single one like the {@link ProductDetailsWidget}.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function BuyTheLookWidget(data) {
            Enrichment.call(this, data);
            this.title = data.title;
            this.description = data.description;
            this.statisticsID = data.statisticsID;
            this.button = data.button;
            this.shapeEnabled = data.shapeEnabled;

            this._productSourceType = data.productSourceType;
            this._externalProducts = data.externalProducts;
            this._productDescriptors = data.productDescriptors;
        }
        BuyTheLookWidget.prototype = Object.create(Enrichment.prototype);

        /**
         * Get the products this widget has.
         *
         * @return {Promise} A promise for the list of {@link Product}s.
         */
        BuyTheLookWidget.prototype.getProducts = function () {
            if (this._productSourceType === BuyTheLookWidget.ProductSource.PRODUCT_DATABASE) {
                return Promise.all(this._productDescriptors.map(function (descriptor) {
                    return new Reference(descriptor).getAs(Product);
                }));
            }
            if (this._productSourceType === BuyTheLookWidget.ProductSource.EXTERNAL) {
                return Promise.resolved(this._externalProducts.map(function (externalProduct) {
                    return new Product({
                        properties: externalProduct
                    });
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
        BuyTheLookWidget.TYPE = "buyTheLookWidget";

        /**
         * The types of product sources.
         * @static
         * @enum BuyTheLookWidget.ProductSource
         */
        BuyTheLookWidget.ProductSource = {
            /**
             * Product database.
             */
            PRODUCT_DATABASE: 1,
            /**
             * External/manual.
             */
            EXTERNAL: 2
        };

        return BuyTheLookWidget;
    });