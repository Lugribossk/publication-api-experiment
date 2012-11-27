define(["jquery", "internal/Reference"],
    function ($, Reference) {
        "use strict";

        /**
         *
         * @param {Object} data
         * @class MediaRepresentation
         */
        function MediaRepresentation(data) {
            /**
             * {String} TODO "the type"?
             */
            this.type = data.type;
            /**
             * {String} The file MIME type.
             */
            this.contentType = data.contentType;
            /**
             * {Number} The file size in bytes.
             */
            this.size = data.size;

            this._mediaSource = data.mediaSource;
        }

        MediaRepresentation.prototype.getBinaryURL = function () {
            return new Reference(this._mediaSource).getBinaryURL();
        };

        return MediaRepresentation;
    });