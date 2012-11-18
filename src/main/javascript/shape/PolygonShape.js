define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        function PolygonShape(data) {
            Shape.call(this, data);
            /**
             * {Object[]} A list of coordinate objects, each with x and y properties with a value between 0-1.
             */
            this.coordinates = data.coordinates;
        }
        PolygonShape.prototype = new Shape();

        PolygonShape.prototype.createDomElement = function () {
            // Multiply the coordinates by 100 since the viewBox is set to 100 x 100.
            // Setting the viewBox to 1 x 1 scales the line strokes up to monstrous size.
            var points = $.map(this.coordinates, function (coord) {
                return (coord.x * 100) + "," + (coord.y * 100);
            }).join(" ");

            // TODO wrap in div?

            // jQuery can't create and append the polygon element individually, so we have to create it as one big string.
            return $("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 100 100'>" +
                        "<polygon points='" + points + "' class='PolygonShape'/>" +
                    "</svg>");
        };

        PolygonShape.TYPE = "polygon";

        return PolygonShape;
    });