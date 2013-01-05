define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         * A link that points to a page in the same publication.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function InternalLink(data) {
            Enrichment.call(this, data);
            /**
             * The page number linked to.
             * @type {Number}
             */
            this.targetPageNumber = data.targetPageNumber;
        }
        InternalLink.prototype = Object.create(Enrichment.prototype);

        InternalLink.prototype.createDomElement = function () {
            var element = Enrichment.prototype.createDomElement.call(this, "Page " + this.targetPageNumber)
                .addClass("InternalLink");

            element.on("dblclick", function () {
                // Since the pages are stacked vertically on top of each other, we can jump to to a particular page by scrolling up/down the right amount.
                $("body").animate({
                    scrollTop: $("#page" + this.targetPageNumber).offset().top
                }, 500);
            }.bind(this));

            return element;
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        InternalLink.TYPE = "internalLink";

        return InternalLink;
    });