define(["jquery"],
    function ($) {
        "use strict";

        function RectangleShape(data) {
            $.extend(this, data);
        }
//        RectangleShape.prototype = new Shape();

        RectangleShape.prototype.createDomElement = function () {
            $("<div/>")
                .addClass("RectangleShape")
                .css({
                    position: "absolute", // TODO Move to class
                    top: this.x * 100 + "%",
                    left: this.y * 100 + "%",
                    height: this.height * 100 + "%",
                    width: this.width * 100 + "%",
                    transform: this.rotation ? "rotate(" + this.rotation + "deg)" : undefined
                });
        };

        return RectangleShape;
    });