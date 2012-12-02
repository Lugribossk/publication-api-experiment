define(["jquery", "util/Logger"],
    function ($, Logger) {
        "use strict";
        var log = new Logger("Shape");

        /**
         * The shape of something relative to the page it is placed on.
         * Properties related to size and positioning are expressed as number between 0 and 1, which should be
         * interpreted as a percentage relative to the page.
         *
         * @abstract
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function Shape(data) {
            /**
             * The type of shape.
             * @type {String}
             */
            this.type = data.type;
        }

        Shape.prototype.createDomElement = function () {
            var scope = this;
            return $("<div/>")
                .on("click", function () {
                    log.info(scope);
                });
        };

        return Shape;
    });