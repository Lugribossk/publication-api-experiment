define(["jquery", "internal/Reference", "util/Logger"],
    function ($, Reference, Logger) {
        "use strict";
        var log = new Logger("Product");

        /**
         * A product.
         *
         * Products can have "master" products that they are more specific "variants" of. E.g. an iPad master product
         * with 16 Gb and 32 Gb size variants.
         * A master product with no master itself is a "root" product, and a variant product without variants itself is
         * a "leaf variant".
         *
         * Products have properties, named attributes with a specific value. The "product_id" property always exists,
         * but all other properties are optional and can have any name.
         * Variant products that do not have a a value for a particular property inherit it from their master product.
         *
         * If an enrichment links to a variant product, that product will itself have any inherited properties placed
         * directly on it, and its master product(s) will only have product_id and possibly name properties.
         *
         * @property {String} product_id Special property whose value is always the product ID (i.e. the value entered when creating product links/widgets).
         * @property {Product[]} variants The variant products.
         * @property {Product/undefined} master The master product. Optional.
         * @property {String/undefined} master_product_id Special property whose value is the product ID of the master product. Optional.
         * @property {Boolean/undefined} enabled Special property that blocks the product from being sent client-side if false. Optional.
         *
         * @class Product
         * @constructor
         *
         * @param {Object} data The raw API data.
         * @param {Product} [existingMaster] For internal use only.
         */
        function Product(data, existingMaster) {
            var output = this,
                master = existingMaster;

            if (data.ancestor) {
                // The master described in data.ancestor does not have a variants property, so this will not cause an infinite loop.
                master = new Product(data.ancestor);
            }

            if (master) {
                // Set the master product as this product's prototype by recreating it.
                // This causes Javascript's prototypal inheritance to look up properties that are not found on this
                // object in its prototype chain, which is exactly what we need for inheriting property values.
                output = Object.create(master);
                output.master = master;
            }

            // Place the properties directly on the object so they are easier to work with and can be inherited individually.
            $.extend(output, data.properties);

            // Hopefully no one will end up creating a property called "variants" or "master".
            if (data.properties && data.properties.variants !== undefined) {
                log.warn("Properties named 'variants' not supported, may cause unexpected behavior.");
            }
            if (data.properties && data.properties.master !== undefined) {
                log.warn("Properties named 'master' not supported, may cause unexpected behavior.");
            }

            if (data.variants) {
                output.variants = data.variants.map(function (variant) {
                    // The variants described in data.variants do not have an ancestor property, as that is implicitly the current product.
                    return new Product(variant, output);
                });
            } else {
                // TODO Causes product.master.variants[0] to behave inconsistently for masters above the linked product.
                output.variants = [];
            }

            return output;
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