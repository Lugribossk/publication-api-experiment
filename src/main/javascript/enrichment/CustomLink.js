define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         * A "custom" link, essentially just a link shape with arbitrary user-defined data.
         *
         * @param {Object} data The raw API data.
         *
         * @class CustomLink
         * @extends Enrichment
         * @author Bo Gotthardt
         */
        function CustomLink(data) {
            Enrichment.call(this, data);
            /**
             * {String
             * @type {*}
             */
            this.value = data.value;
        }
        CustomLink.prototype = Object.create(Enrichment.prototype);

        CustomLink.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, this.value)
                .addClass("CustomLink");
        };

        CustomLink.TYPE = "customLink";

        return CustomLink;
    });