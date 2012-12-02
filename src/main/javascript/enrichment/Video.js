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
        function Video(data) {
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
        Video.prototype = Object.create(Enrichment.prototype);

        Video.prototype.getVideoRepresentations = function () {
            return this._mediaRepresentationDescriptors.map(function (rep) {
                return new MediaRepresentation(rep);
            });
        };

        Video.prototype.getPosterImages = function () {
            return this._posterImageRepresentationDescriptors.map(function (poster) {
                return new MediaRepresentation(poster);
            });
        };

        Video.prototype.createDomElement = function () {
//            var video = $("<video/>", {
//                src: this.getVideoRepresentations()[0].getBinaryURL(),
//                controls: this.enableControls,
//                autoplay: this.playOnLoad,
//                loop: this.loop
//            })
//                .css({
//                    width: "100%",
//                    height: "100%"
//                });

            return Enrichment.prototype.createDomElement.call(this, null, "Video");
//                .append(video);
        };

        Video.TYPE = "videoEnrichment";

        return Video;
    });