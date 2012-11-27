define(["jquery", "util/Inheritance"],
    function ($, Inheritance) {
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
            /**
             * {String} The type of this shape.
             */
            this.type = data.type;
        }

        Inheritance.makeExtensible(Shape);

        return Shape;
    });