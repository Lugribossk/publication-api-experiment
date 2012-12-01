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
             * {Number} The width.
             */
            this.width = data.width;
            /**
             * {Number} The height.
             */
            this.height = data.height;
            /**
             * {Number} The size of the resource in bytes.
             */
            this.size = data.size;
            /**
             * {PageRepresentation.Type} The type of representation.
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

        PageRepresentation.Type = {
            /**
             * A bitmap image (typically JPEG).
             */
            IMAGE: "image",
            /**
             * Flash vector representation (SWF).
             */
            VECTOR: "vector"
        };

        return PageRepresentation;
    });