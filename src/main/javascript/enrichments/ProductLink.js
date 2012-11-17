define(["jquery", "Reference", "Product"],
    function ($, Reference, Product) {
        "use strict";

        function ProductLink(data) {
            $.extend(this, data);
        }

        ProductLink.prototype.getProduct = function () {
            debugger
            if (this.usesProductDatabase) {
                // this.productDescriptor seems to be a reference and not an object.
                return new Reference(this.productDescriptor).getAs(Product);
            } else {
                return new $.Deferred().resolve(new Product({
                    properties: this.manualProduct
                }));
            }
        };

        return ProductLink;
    });