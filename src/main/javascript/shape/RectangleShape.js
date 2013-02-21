define(["shape/Shape"],
    function (Shape) {
        "use strict";

        /**
         * A rectangular shape.
         *
         * @extends Shape
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function RectangleShape(data) {
            Shape.call(this, data);
            /**
             * Top left corner x-coordinate, between 0 and 1.
             * @type {Number}
             */
            this.x = data.x;
            /**
             * Top left corner y-coordinate, between 0 and 1.
             * @type {Number}
             */
            this.y = data.y;
            /**
             * Height, between 0 and 1.
             * @type {Number}
             */
            this.height = data.height;
            /**
             * Width, between 0 and 1.
             * @type {Number}
             */
            this.width = data.width;
            /**
             * Rotation in degrees, between -180 and 180.
             * @type {Number}
             */
            this.rotation = data.rotation;
        }
        RectangleShape.prototype = Object.create(Shape.prototype);

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        RectangleShape.TYPE = "rectangle";

        return RectangleShape;
    });