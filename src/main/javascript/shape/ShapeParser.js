define(["jquery", "shape/RectangleShape", "shape/PolygonShape", "shape/CompositeShape"],
    function ($, RectangleShape, PolygonShape, CompositeShape) {
        "use strict";

        function ShapeParser() {}

        /**
         * Construct an appropriately subtyped Shape from the specified data.
         *
         * @param data
         * @return {Shape}
         */
        ShapeParser.construct = function (data) {
            var type = data.type;
            if (type === RectangleShape.TYPE) {
                return new RectangleShape(data);
            } else if (type === PolygonShape.TYPE) {
                return new PolygonShape(data);
            } else if (type === CompositeShape.TYPE) {
                // We have to parse the composite shapes here as well, or CompositeShape will end up with a circular dependency on ShapeParser.
                return new CompositeShape({
                    shapes: $.map(data.shapes, ShapeParser.construct),
                    type: CompositeShape.TYPE
                });
            } else {
                console.error("Unknown shape type", type);
                return null;
            }
        };

        return ShapeParser;
    });