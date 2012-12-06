define(["jquery", "enrichment/Enrichment", "internal/Reference", "publication/Product", "util/Promise", "util/Logger"],
    function ($, Enrichment, Reference, Product, Promise, Logger) {
        "use strict";
        var log = new Logger("BuyTheLookWidget");

        /**
         * A "buy the look" widget. Also known as "shop the look" and several other similar names.
         *
         * @extends Enrichment
         * @class enrichment.BuyTheLookWidget
         * @alternateClassName BuyTheLookWidget
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

            this._productDescriptors = data.productDescriptors;
        }
        BuyTheLookWidget.prototype = Object.create(Enrichment.prototype);

        /**
         * Get the products this widget has.
         *
         * @return {Promise} A promise for the list of {@link Product}s.
         */
        BuyTheLookWidget.prototype.getProducts = function () {
            var deferreds = this._productDescriptors.map(function (descriptor) {
                return new Reference(descriptor).getAs(Product);
            });

            return Promise.all(deferreds);
        };

        BuyTheLookWidget.prototype.createDomElement = function () {
            var element = Enrichment.prototype.createDomElement.call(this)
                .addClass("BuyTheLookWidget");

            element.on("click", function () {
                this.getProducts()
                    .done(function (products) {
                        log.info(products);
                    });
            }.bind(this));

            return element;
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        BuyTheLookWidget.TYPE = "buyTheLookWidget";

        return BuyTheLookWidget;
    });