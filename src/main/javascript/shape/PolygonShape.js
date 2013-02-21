define(["shape/Shape"],
    function (Shape) {
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

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        PolygonShape.TYPE = "polygon";

        return PolygonShape;
    });