define(["jquery", "shape/ShapeParser"],
    function ($, ShapeParser) {
        "use strict";

        function Enrichment(data) {
            // data will be null when this is called to set up the prototype on subclasses.
            if (!data) { return; }

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