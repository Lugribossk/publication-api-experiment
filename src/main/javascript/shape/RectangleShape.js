define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        /**
         * A rectangular shape.
         *
         * @param {Object} data
         *
         * @class RectangleShape
         * @author Bo Gotthardt
         */
        function RectangleShape(data) {
            Shape.call(this, data);
            /**
             * {Number} Top left corner x-coordinate, between 0-1.
             */
            this.x = data.x;
            /**
             * {Number} Top left corner y-coordinate, between 0-1.
             */
            this.y = data.y;
            /**
             * {Number} Height, between 0-1.
             */
            this.height = data.height;
            /**
             * {Number} Width, between 0-1.
             */
            this.width = data.width;
            /**
             * {Number} Rotation in degrees, between -180-180.
             */
            this.rotation = data.rotation;
        }
        RectangleShape.prototype = Object.create(Shape.prototype);

        RectangleShape.prototype.createDomElement = function () {
            return $("<div/>")
                .addClass("RectangleShape")
                .css({
                    top: this.y * 100 + "%",
                    left: this.x * 100 + "%",
                    height: this.height * 100 + "%",
                    width: this.width * 100 + "%",
                    transform: this.rotation ? "rotate(" + this.rotation + "deg)" : undefined
                });
        };

        RectangleShape.TYPE = "rectangle";

        return RectangleShape;
    });