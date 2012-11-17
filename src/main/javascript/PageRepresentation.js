define(["jquery", "Reference"],
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
            $.extend(this, data);
        }

        /**
         * Get the URL to the image of this page.
         *
         * @return {String}
         */
        PageRepresentation.prototype.getImageURL = function () {
            return new Reference(this.pageRepresentation).getBinaryURL();
        };

        return PageRepresentation;
    });