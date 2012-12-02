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
             * The custom value as a plain object.
             * @type {Object}
             */
            this.value = data.value;
        }
        CustomLink.prototype = Object.create(Enrichment.prototype);

        CustomLink.prototype.createDomElement = function () {
            return Enrichment.prototype.createDomElement.call(this, JSON.stringify(this.value))
                .addClass("CustomLink");
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        CustomLink.TYPE = "customLink";

        return CustomLink;
    });