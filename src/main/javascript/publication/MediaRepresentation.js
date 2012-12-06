define(["jquery", "internal/Reference"],
    function ($, Reference) {
        "use strict";

        /**
         * The data for a piece of media, such as an image or a video.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function MediaRepresentation(data) {
            /**
             * The media representation type, see {@link MediaRepresentation.Type}.
             * @type {String}
             */
            this.type = data.type;
            /**
             * The file MIME type.
             * @type {String}
             */
            this.contentType = data.contentType;
            /**
             * The file size in bytes.
             * @type {Number}
             */
            this.size = data.size;

            this._mediaSource = data.mediaSource;
        }

        /**
         * Get the URL to this media's binary file.
         * What kind of file it is depends on the type and contentType.
         *
         * @return {String}
         */
        MediaRepresentation.prototype.getBinaryURL = function () {
            return new Reference(this._mediaSource).getBinaryURL();
        };


        /**
         * The different types of media representations.
         *
         * @static
         * @enum
         */
        MediaRepresentation.Type = {
            /**
             * An image.
             * @static
             * @const
             */
            IMAGE: "image",
            /**
             * Low resolution m4v format video. MIME-type: "video/mp4".
             * @static
             * @const
             */
            LOW_RESOLUTION_MP4: "low_resolution_mp4",
            /**
             * Medium resolution m4v format video. MIME-type: "video/mp4".
             * @static
             * @const
             */
            MEDIUM_RESOLUTION_MP4: "medium_resolution_mp4",
            /**
             * High resolution m4v format video. MIME-type: "video/mp4".
             * @static
             * @const
             */
            HIGH_RESOLUTION_MP4: "high_resolution_mp4",
            /**
             * Low resolution webm format video. MIME-type: "video/webm".
             * @static
             * @const
             */
            LOW_RESOLUTION_WEBM: "low_resolution_webm",
            /**
             * Medium resolution webm format video. MIME-type: "video/webm".
             * @static
             * @const
             */
            MEDIUM_RESOLUTION_WEBM: "medium_resolution_webm",
            /**
             * High resolution webm format video. MIME-type: "video/webm".
             * @static
             * @const
             */
            HIGH_RESOLUTION_WEBM: "high_resolution_webm"
        };

        return MediaRepresentation;
    });