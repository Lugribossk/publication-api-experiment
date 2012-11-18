define(["jquery"],
    function ($) {
        "use strict";

        /**
         * The shape of something relative to the page it is placed on.
         * Properties related to size and positioning are expressed as number between 0 and 1, which should be
         * interpreted as a percentage relative to the page.
         *
         * @param {Object} data
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