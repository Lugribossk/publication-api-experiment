define(["jquery", "shape/Shape"],
    function ($, Shape) {
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

        RectangleShape.prototype.createDomElement = function () {
            return Shape.prototype.createDomElement.call(this)
                .addClass("RectangleShape")
                .css({
                    top: this.y * 100 + "%",
                    left: this.x * 100 + "%",
                    height: this.height * 100 + "%",
                    width: this.width * 100 + "%",
                    transform: this.rotation ? "rotate(" + this.rotation + "deg)" : undefined
                });
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        RectangleShape.TYPE = "rectangle";

        return RectangleShape;
    });