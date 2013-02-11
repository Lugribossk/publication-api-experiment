define([],
    function () {
        "use strict";

        /**
         * An enrichment tooltip.
         *
         * @class Tooltip
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function Tooltip(data) {
            /**
             * The type of tooltip, see {@link Tooltip.Type}.
             * @type {String}
             */
            this.type = data.type;
            /**
             * The tooltip text.
             * @type {String/undefined}
             */
            this.text = data.text;
            /**
             * The media title.
             * @type {String/undefined}
             */
            this.title = data.title;
            /**
             * The media description.
             * @type {String/undefined}
             */
            this.description = data.description;
        }

        /**
         * @static
         * @enum Tooltip.Type
         */
        Tooltip.Type = {
            TEXT: "text",
            MEDIA: "media"
        };

        return Tooltip;
    });