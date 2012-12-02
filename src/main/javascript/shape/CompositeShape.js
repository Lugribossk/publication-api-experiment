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
            return $("<div/>")
                .addClass("CompositeShape")
                .append(this.shapes.map(function (shape) {
                    return shape.createDomElement();
                }));
        };

        /**
         * The API type value for this kind of shape.
         * @static
         * @const
         * @type {string}
         */
        CompositeShape.TYPE = "composite";

        return CompositeShape;
    });