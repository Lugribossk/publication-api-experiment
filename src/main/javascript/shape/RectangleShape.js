define(["jquery", "shape/Shape"],
    function ($, Shape) {
        "use strict";

        function RectangleShape(data) {
            Shape.call(this, data);
            this.x = data.x;
            this.y = data.y;
            this.height = data.height;
            this.width = data.width;
            this.rotation = data.rotation;
        }
        RectangleShape.prototype = new Shape();

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