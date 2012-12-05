define(["jquery", "shape/RectangleShape", "shape/PolygonShape", "shape/CompositeShape", "util/Logger"],
    function ($, RectangleShape, PolygonShape, CompositeShape, Logger) {
        "use strict";
        var log = new Logger("ShapeParser");

        /**
         * Utility class for converting untyped objects into Shape subclass instances.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function ShapeParser() {}

        /**
         * Construct an appropriately subclassed Shape instance from the specified data.
         *
         * @param {Object} data The raw API data.
         * @return {Shape}
         */
        ShapeParser.construct = function (data) {
            switch (data.type) {
            case RectangleShape.TYPE:
                return new RectangleShape(data);
            case PolygonShape.TYPE:
                return new PolygonShape(data);
            case CompositeShape.TYPE:
                // We have to parse the composite shapes here as well, or CompositeShape will end up with a circular dependency on ShapeParser.
                return new CompositeShape({
                    shapes: data.shapes.map(ShapeParser.construct),
                    type: CompositeShape.TYPE
                });
            default:
                log.warn("Unknown shape type", data.type);
                return null;
            }
        };

        return ShapeParser;
    });