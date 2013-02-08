/*global describe, it, expect, spyOn, beforeEach, afterEach, jasmine*/
/**
 * Tests for {@link Product}.
 *
 * @author Bo Gotthardt
 */
define(["jquery", "publication/Product"],
    function ($, Product) {
        "use strict";

        describe("Product", function () {
            describe("properties", function () {
                it("should be placed directly on the object.", function () {
                    var product = new Product({
                        properties: {
                            product_id: "abc",
                            name: "def"
                        }
                    });

                    expect(product.product_id).toBe("abc");
                    expect(product.name).toBe("def");
                });

                it("should be inherited from ancestor.", function () {
                    var product = new Product({
                        ancestor: {
                            properties: {
                                name: "abc"
                            }
                        }
                    });

                    expect(product.name).toBe("abc");
                });

                it("should be inherited from higher level ancestor.", function () {
                    var product = new Product({
                        ancestor: {
                            ancestor: {
                                properties: {
                                    name: "abc"
                                }
                            }
                        }
                    });

                    expect(product.name).toBe("abc");
                });

                it("should use own value instead of inherited value.", function () {
                    var product = new Product({
                        properties: {
                            name: "def"
                        },
                        ancestor: {
                            properties: {
                                name: "abc"
                            }
                        }
                    });

                    expect(product.name).toBe("def");
                });
            });
        });
    });