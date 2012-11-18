define(["jquery", "shape/ShapeParser"],
    function ($, ShapeParser) {
        "use strict";

        function Enrichment(data) {
            $.extend(this, data);
        }

        Enrichment.prototype.getShape = function () {
            return ShapeParser.construct(this.shape);
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