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
            if (!data) { return; }

            /**
             * {String} The type of this shape.
             */
            this.type = data.type;
        }

        return Shape;
    });