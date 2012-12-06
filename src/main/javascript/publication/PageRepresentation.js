define(["jquery", "internal/Reference", "util/Logger"],
    function ($, Reference, Logger) {
        "use strict";
        var log = new Logger("PageRepresentation");

        /**
         * The data for a visual representation of a page, i.e. the size and URL of an image of it.
         * A logical page can have many page representations, e.g. images in different sizes and formats.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw object to convert to a PageRepresentation object.
         */
        function PageRepresentation(data) {
            /**
             * The width.
             * @type {Number}
             */
            this.width = data.width;
            /**
             * The height.
             * @type {Number}
             */
            this.height = data.height;
            /**
             * The size of the resource in bytes.
             * @type {Number}
             */
            this.size = data.size;
            /**
             * The type of representation, see {@link PageRepresentation.Type}
             * @type {String}
             */
            this.type = data.type;

            this._pageRepresentation = data.pageRepresentation;
        }

        /**
         * Get the URL to the image of this page.
         *
         * @return {String}
         */
        PageRepresentation.prototype.getImageURL = function () {
            return new Reference(this._pageRepresentation).getBinaryURL();
        };

        PageRepresentation.prototype.createDomElement = function () {
            if (this.type !== PageRepresentation.Type.IMAGE) {
                log.error("Trying to create DOM element for non-image page representation.", this);
            }
            return $("<img/>", {
                src: this.getImageURL()
            }).addClass("PageRepresentation");
        };

        /**
         * The different kinds of page representations.
         *
         * @static
         * @enum
         */
        PageRepresentation.Type = {
            /**
             * A bitmap image (typically JPEG).
             * @static
             * @const
             */
            IMAGE: "image",
            /**
             * Flash vector representation (SWF).
             * @static
             * @const
             */
            VECTOR: "vector"
        };

        return PageRepresentation;
    });