define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         * A "custom" link, essentially just a link shape with arbitrary user-defined data.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
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
            return Enrichment.prototype.createDomElement.call(this, JSON.stringify(this.value))
                .addClass("CustomLink");
        };

        CustomLink.TYPE = "customLink";

        return CustomLink;
    });