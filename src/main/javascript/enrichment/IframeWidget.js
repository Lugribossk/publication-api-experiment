define(["enrichment/Enrichment"],
    function (Enrichment) {
        "use strict";

        /**
         * An iframe widget.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function IframeWidget(data) {
            Enrichment.call(this, data);

            this.url = data.url;
            this.interactive = data.interactive;
            this.fullPage = data.fullPage;
        }
        IframeWidget.prototype = Object.create(Enrichment.prototype);

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        IframeWidget.TYPE = "iframeWidget";

        return IframeWidget;
    });