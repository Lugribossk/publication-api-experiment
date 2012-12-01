define(["jquery", "enrichment/Enrichment", "internal/Reference", "publication/Product"],
    function ($, Enrichment, Reference, Product) {
        "use strict";

        /**
         * A "buy the look" widget. Also known as "shop the look" and several other similar names.
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

            this._productDescriptors = data.productDescriptors;
//            this._mediaRepresentationDescriptors = data.mediaRepresentationDescriptors;
        }
        BuyTheLookWidget.prototype = Object.create(Enrichment.prototype);

        /**
         * Get the products this widget has.
         *
         * @return {Promise} A promise for the list of {@link Product}s.
         */
        BuyTheLookWidget.prototype.getProducts = function () {
            var deferreds = $.map(this._productDescriptors, function (descriptor) {
                return new Reference(descriptor).getAs(Product);
            });

            return $.when.apply(this, deferreds)
                .then(function () {
                    return $.makeArray(arguments);
                });
        };

        BuyTheLookWidget.prototype.createDomElement = function () {
            // TODO Product IDs label?
            return Enrichment.prototype.createDomElement.call(this)
                .addClass("ProductDetailsWidget");
        };

        // TODO hasProducts = true ?

        BuyTheLookWidget.TYPE = "buyTheLookWidget";

        return BuyTheLookWidget;
    });