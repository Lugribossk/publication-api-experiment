define(["jquery", "enrichment/Enrichment", "publication/MediaRepresentation"],
    function ($, Enrichment, MediaRepresentation) {
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
             * @type {Boolean}
             */
            this.playOnLoad = data.playOnLoad;
            /**
             * @type {Boolean}
             */
            this.enableControls = data.enableControls;
            /**
             * @type {Boolean}
             */
            this.showWhenHovering = data.showWhenHovering;
            /**
             * @type {Boolean}
             */
            this.loop = data.loop;
            /**
             * @type {Boolean}
             */
            this.usesExternalSource = data.usesExternalSource;
            /**
             * @type {String}
             */
            this.externalSource = data.externalSource;

            this._posterImageRepresentationDescriptors = data.posterImageRepresentationDescriptors;
        }
        VideoEnrichment.prototype = Object.create(Enrichment.prototype);

        VideoEnrichment.prototype.getVideoRepresentations = function () {
            return this._mediaRepresentationDescriptors.map(function (rep) {
                return new MediaRepresentation(rep);
            });
        };

        VideoEnrichment.prototype.getPosterImages = function () {
            return this._posterImageRepresentationDescriptors.map(function (poster) {
                return new MediaRepresentation(poster);
            });
        };

        VideoEnrichment.prototype.createDomElement = function () {
//            var video = $("<video/>", {
//                src: this.getVideoRepresentations()[0].getBinaryURL(),
//                controls: this.enableControls,
//                autoplay: this.playOnLoad,
//                loop: this.loop,
//                poster: this.getPosterImages()[0].getBinaryURL()
//            })
//                .css({
//                    width: "100%",
//                    height: "100%"
//                });

            return Enrichment.prototype.createDomElement.call(this)
                .addClass("VideoEnrichment");
//                .append(video);
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