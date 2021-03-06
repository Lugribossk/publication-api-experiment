define(["shape/Shape"],
    function (Shape) {
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

        /**
         * The API type value for this kind of shape.
         * @static
         * @const
         * @type {String}
         */
        CompositeShape.TYPE = "composite";

        return CompositeShape;
    });