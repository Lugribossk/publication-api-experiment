define(["jquery", "shape/ShapeParser", "util/Logger", "publication/MediaRepresentation", "enrichment/Tooltip"],
    function ($, ShapeParser, Logger, MediaRepresentation, Tooltip) {
        "use strict";
        var log = new Logger("Enrichment");

        /**
         * Abstract base class for the different enrichment types.
         *
         * @abstract
         * @class Enrichment
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

            // Only available on non-widget, non-video enrichments.
            /**
             * The enrichment's hex color, in base 10.
             * @type {Number/undefined}
             */
            this.color = data.color;
            /**
             * The opacity, between 0 (transparent) and 100 (solid).
             * @type {Number/undefined}
             */
            this.opacity = data.opacity;
            /**
             * The enrichment "effect", see {@link Enrichment.EffectType}
             * @type {String/undefined}
             */
            this.effect = data.effect;

            this._mediaRepresentationDescriptors = data.mediaRepresentationDescriptors;
            this._tooltip = data.tooltip;

            this._shape = data.shape;
        }

        /**
         * Get this enrichment's shape.
         *
         * @return {Shape}
         */
        Enrichment.prototype.getShape = function () {
            return new ShapeParser().construct(this._shape);
        };

        /**
         * Get this enrichment's color as a CSS string (i.e. "#123abc").
         *
         * @return {String/undefined} The color, or undefined if it does not have one.
         */
        Enrichment.prototype.getCSSColor = function () {
            if (this.color === undefined) {
                return undefined;
            }
            return "#" + this.color.toString(16);
        };

        /**
         * Get this enrichment's media representations.
         * What this is a media representation *of* depends on the kind of enrichment.
         *
         * @return {MediaRepresentation[]}
         */
        Enrichment.prototype.getMediaRepresentations = function () {
            // The media representation descriptors property is optional rather than the empty list.
            if (!this._mediaRepresentationDescriptors) {
                return [];
            }

            return this._mediaRepresentationDescriptors.map(function (rep) {
                return new MediaRepresentation(rep);
            });
        };

        /**
         *
         * @return {Tooltip}
         */
        Enrichment.prototype.getTooltip = function () {
            return new Tooltip(this._tooltip);
        };

        Enrichment.prototype.createDomElement = function (cssClass, label, clickLog) {
            var scope = this,
                element = this.getShape().createDomElement()
                    .addClass("Enrichment")
                    .addClass(cssClass);

            if (label) {
                $.when(label)
                    .done(function (value) {
                        $("<span/>")
                            .addClass("Label")
                            .text(value)
                            .appendTo(element);
                    });
            }

            element.on("click", function () {
                log.info(scope);
                if (clickLog) {
                    log.info(clickLog);
                }
            });

            return element;
        };

        /**
         * The different types of enrichment effects.
         *
         * @static
         * @enum Enrichment.EffectType
         */
        Enrichment.EffectType = {
            NONE: "none",
            FADE: "fadeInOut",
            FRAME: "frame",
            PULSATING: "pulsating",
            SHADOW_FRAME: "shadowFrame"
        };

        return Enrichment;
    });