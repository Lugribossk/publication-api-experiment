define(["jquery", "shape/RectangleShape", "shape/PolygonShape", "shape/CompositeShape"],
    function ($, RectangleShape, PolygonShape, CompositeShape) {
        "use strict";

        function ShapeParser() {
        }

        /**
         * Construct an appropriately subtyped Shape from the specified data.
         *
         * @param data
         * @return {Shape}
         */
        ShapeParser.construct = function (data) {
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

        return ShapeParser;
    });