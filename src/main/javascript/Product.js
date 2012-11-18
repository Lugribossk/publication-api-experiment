define(["jquery", "internal/Reference"],
    function ($, Reference) {
        "use strict";

        function Product(data) {
            // Place the properties directly on the object so they are easier to work with.
            $.extend(this, data.properties);
            // Hopefully no one will end up creating custom properties with the same names as these.
            if (data.variants) {
                this.variants = $.map(data.variants, function (variant) {
                    return new Product(variant);
                });
            }
            if (data.ancestor) {
                this.ancestor = new Product(data.ancestor);
            }
        }

//        Product.prototype.getImages = function () {
//            if (this.images) {
//                return $.map(this.images, function (image) {
//                    return new Reference(image).getBinaryURL();
//                });
//            } else {
//                return [];
//            }
//        };

        return Product;
    });