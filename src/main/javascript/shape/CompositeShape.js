define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        function CompositeShape(data) {
            Shape.call(this, data);
            /**
             * {Shape[]} The shapes this consists of.
             */
            this.shapes = data.shapes;
        }
        CompositeShape.prototype = new Shape();

        CompositeShape.prototype.createDomElement = function () {
            return $.map(this.shapes, function (shape) {
                return shape.createDomElement();
            });
        };

        CompositeShape.TYPE = "composite";

        return CompositeShape;
    });