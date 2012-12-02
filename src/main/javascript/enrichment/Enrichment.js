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
            this.type = data.type;
            this.firstPageNumber = data.firstPageNumber;
            this.lastPageNumber = data.lastPageNumber;

            // non-widget, non-video
            this.color = data.color;
            this.opacity = data.opacity;
            this.effect = data.effect;

            // optional
            this._mediaRepresentationDescriptors = data.mediaRepresentationDescriptors;
            this._tooltip = data.tooltip;

            this._shape = data.shape;
        }

        Enrichment.prototype.getShape = function () {
            return ShapeParser.construct(this._shape);
        };

        Enrichment.prototype.createDomElement = function (label, extraClass) {
            var element = this.getShape().createDomElement();

            // addClass() doesn't work with <svg>
            element.attr("class", element.attr("class") + " Enrichment " + (extraClass || ""));

            if (label) {
                $("<span/>")
                    .addClass("Label")
                    .text(label)
                    .appendTo(element);
            }

            var scope = this;
            element.on("click", function () {
                log.info(scope);
            });

            return element;
        };

        Enrichment.EffectTypes = {
            NONE: "none",
            FADE: "fadeInOut",
            FRAME: "frame",
            PULSATING: "pulsating",
            SHADOW_FRAME: "shadowFrame"
        };

        return Enrichment;
    });