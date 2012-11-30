define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         *
         * @param data
         * @class CustomLink
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