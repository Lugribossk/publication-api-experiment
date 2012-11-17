define(["jquery"],
    function ($) {
        "use strict";

        function Product(data) {
            $.extend(this, data.properties);
            // Hopefully no one will end up creating custom properties with the same names as these.
            this.variants = $.map(data.variants, function (variant) {
                return new Product(variant);
            });
            this.ancestor = data.ancestor;
        }

        return Product;
    });