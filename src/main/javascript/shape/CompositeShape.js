define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        /**
         * A shape composed of other shapes.
         *
         * @param {Object} data The raw API data.
         *
         * @class CompositeShape
         * @extends Shape
         * @author Bo Gotthardt
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
            this.shapes.map(function (shape) {
                return shape.createDomElement();
            });
        };

        CompositeShape.TYPE = "composite";

        return CompositeShape;
    });