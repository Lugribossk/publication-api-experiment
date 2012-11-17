define(["jquery", "shape/Shape", "enrichments/ProductLink"],
    function ($, Shape, ProductLink) {
        "use strict";

        function Enrichment(data) {
            $.extend(this, data);
        }

        Enrichment.prototype.getShape = function () {
            return Shape.construct(this.shape);
        };

        Enrichment.construct = function (data) {
            var type = data.type;
            if (type === "productLink") {
                return new ProductLink(data);
            }
        };

        // TODO
        ProductLink.prototype = new Enrichment();

        return Enrichment;
    });