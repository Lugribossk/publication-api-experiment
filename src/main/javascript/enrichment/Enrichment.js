define(["jquery", "shape/ShapeParser", "util/Logger"],
    function ($, ShapeParser, Logger) {
        "use strict";
        var log = new Logger("Enrichment");

        /**
         * Abstract base class for the different enrichment types.
         *
         * @abstract
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} data The raw API data.
         */
        function Enrichment(data) {
            /**
             * The type of enrichment.
             * @type {String}
             */
            this.type = data.type;
            /**
             * The first page the enrichment is on.
             * @type {Number}
             */
            this.firstPageNumber = data.firstPageNumber;
            /**
             * The last page the enrichment is on.
             * This will only be different from firstPageNumber for "page-spanning" enrichments.
             * @type {Number}
             */
            this.lastPageNumber = data.lastPageNumber;

            // non-widget, non-video
            /**
             * The enrichment's hex color, in base 10.
             * @type {Number}
             */
            this.color = data.color;
            /**
             * The opacity, between 0 (transparent) and 100 (solid).
             * @type {Number}
             */
            this.opacity = data.opacity;
            /**
             * The enrichment "effect", see {@link Enrichment.EffectTypes}
             * @type {String}
             */
            this.effect = data.effect;

            // optional
            this._mediaRepresentationDescriptors = data.mediaRepresentationDescriptors;
            this._tooltip = data.tooltip;

            this._shape = data.shape;
        }

        Enrichment.prototype.getShape = function () {
            return new ShapeParser().construct(this._shape);
        };

        /**
         * Get this enrichment's color as a CSS string (i.e. "#123abc").
         *
         * @return {String} The color, or null if it does not have one.
         */
        Enrichment.prototype.getCSSColor = function () {
            if (this.color === undefined) {
                return null;
            }
            return "#" + this.color.toString(16);
        };

        Enrichment.prototype.createDomElement = function (label) {
            var element = this.getShape().createDomElement()
                .addClass("Enrichment");

            if (label) {
                $("<span/>")
                    .addClass("Label")
                    .text(label)
                    .appendTo(element);
            }

            element.on("click", function () {
                log.info(this);
            }.bind(this));

            return element;
        };

        /**
         * The different types of enrichment effects.
         *
         * @static
         * @enum
         */
        Enrichment.EffectTypes = {
            NONE: "none",
            FADE: "fadeInOut",
            FRAME: "frame",
            PULSATING: "pulsating",
            SHADOW_FRAME: "shadowFrame"
        };

        return Enrichment;
    });