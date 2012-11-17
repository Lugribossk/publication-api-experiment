define(["jquery", "shape/RectangleShape", "shape/PolygonShape", "shape/CompositeShape"],
    function ($, RectangleShape, PolygonShape, CompositeShape) {
        "use strict";

        /**
         * The shape of something relative to the page it is placed on.
         *
         * @param data
         *
         * @class Shape
         * @author Bo Gotthardt
         */
        function Shape(data) {
            $.extend(this, data);
        }

        /**
         * Construct an appropriately subtyped Shape from the specified data.
         *
         * @param data
         * @return {Shape}
         */
        Shape.construct = function (data) {
            var type = data.type;
            if (type === "rectangle") {
                return new RectangleShape(data);
            } else if (type === "polygon") {
                return new PolygonShape(data);
            } else if (type === "composite") {
                return new CompositeShape(data);
            } else {
                console.error("Unknown shape type", type);
                return null;
            }
        };


        // TODO Fix circular dependency properly
        RectangleShape.prototype = new Shape();

        return Shape;
    });