define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        /**
         * A polygon shape.
         *
         * TODO fix example
         *     @example
         *     require(["shape/PolygonShape"], function (PolygonShape) {
         *         new PolygonShape({
         *             type: "polygon",
         *             coordinates: [{y: 0.3557, x: 0.1089}, {y: 0.3694, x: 0.4711}, {y: 0.0997, x: 0.4689},
         *                           {y: 0.3986, x: 0.14}, {y: 0.2629, x: 0.5222}, {y: 0.0945, x: 0.1356}]
         *         }).createDomElement().css({stroke: "blue"}).appendTo("body");
         *     });
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
             * A list of coordinate objects, each with x and y properties with a value between 0 and 1.
             * @type {Object[]}
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

            // preserveAspectRatio=none to ensure that the svg can be rescaled freely, even if the square viewbox ends up on a non-square page.
            // Wrap in shape div and insert polygon directly as string since jQuery has problems handling svgs.
            return Shape.prototype.createDomElement.call(this)
                .addClass("PolygonShape")
                .append("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 100 100' preserveAspectRatio='none'>" +
                            "<polygon points='" + points + "'/>" +
                        "</svg>");
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        PolygonShape.TYPE = "polygon";

        return PolygonShape;
    });