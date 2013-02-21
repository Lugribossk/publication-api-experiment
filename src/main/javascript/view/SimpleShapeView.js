define(["jquery", "shape/CompositeShape", "shape/PolygonShape", "shape/RectangleShape", "shape/Shape", "util/Logger"],
    function ($, CompositeShape, PolygonShape, RectangleShape, Shape, Logger) {
        "use strict";
        var log = new Logger("SimpleShapeView");

        /**
         * Simple views for the shape classes.
         *
         * @author Bo Gotthardt
         * @constructor
         */
        function SimpleShapeView() {}

        /**
         * @inheritDoc
         */
        CompositeShape.prototype.createDomElement = function () {
            return Shape.prototype.createDomElement.call(this)
                .addClass("CompositeShape")
                .append(this.shapes.map(function (shape) {
                    return shape.createDomElement();
                }));
        };

        /**
         * @inheritDoc
         */
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
         * @inheritDoc
         */
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
         * Create a DOM element that visualizes this shape.
         *
         * @return {jQuery} The element
         */
        Shape.prototype.createDomElement = function () {
            var scope = this;
            return $("<div/>")
                .addClass("Shape")
                .on("click", function () {
                    log.info(scope);
                });
        };
    });