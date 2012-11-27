define(["jquery", "shape/ShapeParser", "util/Inheritance"],
    function ($, ShapeParser, Inheritance) {
        "use strict";

        /**
         *
         * @param {Object} data
         * @class Enrichment
         */
        function Enrichment(data) {
            this.type = data.type;
            this.firstPageNumber = data.firstPageNumber;
            this.lastPageNumber = data.lastPageNumber;

            // non-widget
            this.color = data.color;
            this.opacity = data.opacity;
            this.effect = data.effect;

            // optional
            this._mediaRepresentationDescriptors = data.mediaRepresentationDescriptors;
            this._tooltip = data.tooltip;

            this._shape = data.shape;
        }

        Inheritance.makeExtensible(Enrichment);

        Enrichment.prototype.getShape = function () {
            return ShapeParser.construct(this._shape);
        };

        Enrichment.prototype.createDomElement = function (label) {
            var element = this.getShape().createDomElement()
                .addClass("Enrichment");

            if (label) {
                $("<span/>")
                    .addClass("Label")
                    .text(label)
                    .appendTo(element);
            }

            return element;
        };

        return Enrichment;
    });