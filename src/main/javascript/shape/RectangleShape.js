define(["jquery"],
    function ($) {
        "use strict";

        function RectangleShape(data) {
            $.extend(this, data);
        }
//        RectangleShape.prototype = new Shape();

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

        return RectangleShape;
    });