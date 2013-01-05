define(["jquery", "enrichment/Enrichment", "util/window"],
    function ($, Enrichment, window) {
        "use strict";

        /**
         * A link to an external website.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function ExternalLink(data) {
            Enrichment.call(this, data);
            /**
             * The window to open the URL in.
             * @type {String}
             */
            this.target = data.target;
            /**
             * The external link URL.
             * @type {String}
             */
            this.url = data.url;
        }
        ExternalLink.prototype = Object.create(Enrichment.prototype);

        ExternalLink.prototype.createDomElement = function () {
            var element = Enrichment.prototype.createDomElement.call(this, this.url + ", " + this.target)
                .addClass("ExternalLink");

            element.on("dblclick", function () {
                window.open(this.url, "_blank");
            }.bind(this));

            return element;
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        ExternalLink.TYPE =  "externalLink";

        return ExternalLink;
    });