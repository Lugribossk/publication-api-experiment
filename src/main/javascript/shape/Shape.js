define(["jquery"],
    function ($) {
        "use strict";

        /**
         * The shape of something relative to the page it is placed on.
         *
         * @param data
         *
         * @class Shape
         * @author Bo Gotthardt
         */
        function Shape(data) {
            $.extend(this, data);
        }

        return Shape;
    });