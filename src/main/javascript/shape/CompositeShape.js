define(["jquery"],
    function ($) {
        "use strict";

        function CompositeShape(data) {
            $.extend(this, data);
        }

        CompositeShape.prototype.createDomElement = function () {
            return $.map(this.shapes, function (shape) {
                return shape.createDomElement();
            });
        };

        CompositeShape.TYPE = "composite";

        return CompositeShape;
    });