define(["jquery", "enrichments/Enrichment", "internal/Reference", "Product"],
    function ($, Enrichment, Reference, Product) {
        "use strict";

        function BuyTheLookWidget(data) {
            Enrichment.call(this, data);
            this.title = data.title;
            this.description = data.description;
            this.statisticsID = data.statisticsID;
            this.button = data.button;
            this.shapeEnabled = data.shapeEnabled;

            this._productDescriptors = data.productDescriptors;
            this._mediaRepresentationDescriptors = data.mediaRepresentationDescriptors;
        }
        BuyTheLookWidget.prototype = new Enrichment();

        /**
         * Get the products this widget has.
         *
         * @return {$.Deferred} A deferred that resolves with the list of products.
         */
        BuyTheLookWidget.prototype.getProduct = function () {
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

        return BuyTheLookWidget;
    });