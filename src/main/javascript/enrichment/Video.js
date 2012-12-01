define(["jquery", "enrichment/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        /**
         * A video enrichment.
         *
         * @extends Enrichment
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function Video(data) {
            Enrichment.call(this, data);
            /**
             * {Boolean}
             */
            this.playOnLoad = data.playOnLoad;
            /**
             * {Boolean}
             */
            this.enableControls = data.enableControls;
            /**
             * {Boolean}
             */
            this.showWhenHovering = data.showWhenHovering;
            /**
             * {Boolean}
             */
            this.loop = data.loop;

            /**
             * {Boolean}
             */
            this.usesExternalSource = data.usesExternalSource;
            /**
             * {String}
             */
            this.externalSource = data.externalSource;

            // Video sources added as this._mediaRepresentationDescriptors in Enrichment

            // List of MediaRepresentations?
            this._posterImageRepresentationDescriptors = data.posterImageRepresentationDescriptors;
        }
        Video.prototype = Object.create(Enrichment.prototype);

        Video.TYPE = "videoEnrichment";

        return Video;
    });