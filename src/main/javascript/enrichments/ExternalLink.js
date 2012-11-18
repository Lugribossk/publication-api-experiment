define(["jquery", "enrichments/Enrichment"],
    function ($, Enrichment) {
        "use strict";

        function ExternalLink(data) {
            Enrichment.call(this, data);
            /**
             * {String} The window to open the URL in.
             */
            this.target = data.target;
            /**
             * {String} The external link URL.
             */
            this.url = data.url;
        }
//        ExternalLink.prototype.__proto__ = Enrichment.prototype;
        ExternalLink.prototype = new Enrichment();

        ExternalLink.prototype.createDomElement = function () {
            // As an alternative we could ignore the superclass method and make this one an actual link instead.
            return Enrichment.prototype.createDomElement.call(this, this.url + ", " + this.target)
                .addClass("ExternalLink");
        };

        ExternalLink.TYPE =  "externalLink";

        return ExternalLink;
    });