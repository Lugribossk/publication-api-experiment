define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        /**
         * A shape composed of other shapes.
         *
         * @param {Object} data
         * @class CompositeShape
         */
        function CompositeShape(data) {
            Shape.call(this, data);
            /**
             * {Shape[]} The shapes this consists of.
             */
            this.shapes = data.shapes;
        }
        CompositeShape.prototype = Object.create(Shape.prototype);

        CompositeShape.prototype.createDomElement = function () {
            return $.map(this.shapes, function (shape) {
                return shape.createDomElement();
            });
        };

        CompositeShape.TYPE = "composite";

        return CompositeShape;
    });