define(["jquery", "shape/Shape", "util/Logger"],
    function ($, Shape, Logger) {
        "use strict";
        var log = new Logger("PolygonShape");

        /**
         * A polygon shape.
         *
         * @extends Shape
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function PolygonShape(data) {
            Shape.call(this, data);
            /**
             * {Object[]} A list of coordinate objects, each with x and y properties with a value between 0-1.
             */
            this.coordinates = data.coordinates;
        }
        PolygonShape.prototype = Object.create(Shape.prototype);

        PolygonShape.prototype.createDomElement = function () {
            // Multiply the coordinates by 100 since the viewBox is set to 100 x 100.
            // Setting the viewBox to 1 x 1 scales the line strokes up to monstrous size.
            var points = this.coordinates.map(function (coord) {
                return (coord.x * 100) + "," + (coord.y * 100);
            }).join(" ");

            var element = $("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' class='PolygonShape' viewBox='0 0 100 100'>" +
                                "<polygon points='" + points + "'/>" +
                            "</svg>");

            var scope = this;
            element.find("polygon").on("click", function () {
                log.info(scope);
            });

            return element;
        };

        PolygonShape.TYPE = "polygon";

        return PolygonShape;
    });