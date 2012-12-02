define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        /**
         * A shape composed of other shapes.
         *
         * @extends Shape
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function CompositeShape(data) {
            Shape.call(this, data);
            /**
             * The shapes this consists of.
             * @type {Shape[]}
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