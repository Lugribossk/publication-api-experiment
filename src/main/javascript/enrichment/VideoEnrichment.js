define(["enrichment/Enrichment", "publication/MediaRepresentation"],
    function (Enrichment, MediaRepresentation) {
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
        function VideoEnrichment(data) {
            Enrichment.call(this, data);
            /**
             * Whether the video should autoplay.
             * @type {Boolean}
             */
            this.playOnLoad = data.playOnLoad;
            /**
             * Whether player controls are enabled.
             * @type {Boolean}
             */
            this.enableControls = data.enableControls;
            /**
             * TODO
             * @type {Boolean}
             */
            this.showWhenHovering = data.showWhenHovering;
            /**
             * Whether the video should restart when it reaches the end.
             * @type {Boolean}
             */
            this.loop = data.loop;
            /**
             * TODO
             * @type {Boolean}
             */
            this.usesExternalSource = data.usesExternalSource;
            /**
             * TODO
             * @type {String}
             */
            this.externalSource = data.externalSource;

            this._posterImageRepresentationDescriptors = data.posterImageRepresentationDescriptors;
        }
        VideoEnrichment.prototype = Object.create(Enrichment.prototype);

        /**
         * Get the media representations for the poster images.
         *
         * @return {MediaRepresentation[]}
         */
        VideoEnrichment.prototype.getPosterImages = function () {
            return this._posterImageRepresentationDescriptors.map(function (poster) {
                return new MediaRepresentation(poster);
            });
        };

        /**
         * The API type value for this kind of enrichment.
         * @static
         * @const
         * @type {String}
         */
        VideoEnrichment.TYPE = "videoEnrichment";

        return VideoEnrichment;
    });