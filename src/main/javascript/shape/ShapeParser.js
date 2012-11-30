define(["jquery", "shape/RectangleShape", "shape/PolygonShape", "shape/CompositeShape", "util/Logger"],
    function ($, RectangleShape, PolygonShape, CompositeShape, Logger) {
        "use strict";
        var log = new Logger("ShapeParser");

        /**
         * Utility class for converting untyped objects into Shape subclass instances.
         *
         * @class ShapeParser
         * @author Bo Gotthardt
         */
        function ShapeParser() {}

        /**
         * Construct an appropriately subclassed Shape instance from the specified data.
         *
         * @param {Object} data
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
                    shapes: data.shapes.map(ShapeParser.construct),
                    type: CompositeShape.TYPE
                });
            } else {
                log.warn("Unknown shape type", type);
                return null;
            }
        };

        return ShapeParser;
    });