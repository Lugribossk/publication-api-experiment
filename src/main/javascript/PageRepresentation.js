define(["jquery", "internal/Reference"],
    function ($, Reference) {
        "use strict";

        /**
         * The data for a visual representation of a page, i.e. the size and URL of an image of it.
         * A logical page can have many page representations, e.g. images in different sizes and formats.
         *
         * @param {Object} data The raw object to convert to a PageRepresentation object.
         *
         * @class PageRepresentation
         * @author Bo Gotthardt
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
                console.error("Trying to create DOM element for non-image page representation.", this);
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