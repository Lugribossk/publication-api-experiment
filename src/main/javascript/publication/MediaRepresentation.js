define(["jquery", "internal/Reference"],
    function ($, Reference) {
        "use strict";

        /**
         * @constructor
         *
         * @param {Object} data
         */
        function MediaRepresentation(data) {
            /**
             * {String} TODO "the type"?
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

        MediaRepresentation.prototype.getBinaryURL = function () {
            return new Reference(this._mediaSource).getBinaryURL();
        };

        return MediaRepresentation;
    });