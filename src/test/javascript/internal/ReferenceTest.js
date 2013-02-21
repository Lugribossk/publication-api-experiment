/*global describe, it, expect, spyOn, beforeEach, afterEach, jasmine*/
/**
 * Tests for {@link Reference}.
 *
 * @author Bo Gotthardt
 */
define(["jquery", "internal/Reference", "util/Logger", "util/Promise", "util/Ajax"],
    function ($, Reference, Logger, Promise, Ajax) {
        "use strict";

        describe("Reference", function () {

            var baseURL = "http://www.baseurl.com/";
            Reference.setBaseURL(baseURL);

            describe("with 'resource URL' type", function () {
                var ref,
                    url = "http://www.example.com/path";

                beforeEach(function () {
                    ref = new Reference({
                        resourceURL: url
                    });
                });

                it("should have its value as binary URL.", function () {
                    expect(ref.getBinaryURL()).toBe(url);
                });

                describe("resolution", function () {
                    it("should GET the URL as JSON.", function () {
                        spyOn(Ajax, "get").andReturn(new $.Deferred());

                        var promise = ref.get();

                        expect(Ajax.get).toHaveBeenCalledWith({url: ref.getBinaryURL()});
                    });

                    it("should return the response value.", function () {
                        var deferred = new $.Deferred(),
                            response = "12345";
                        spyOn(Ajax, "get").andReturn(deferred);

                        var promise = ref.get();
                        deferred.resolve(response);

                        expect(promise).toHaveResolvedWith(response);
                    });
                });

            });

            describe("with 'resource path' type", function () {
                var ref,
                    path = "path";

                beforeEach(function () {
                    ref = new Reference({
                        resourcePath: path
                    });
                });

                it("should append its path to the baseURL as binary URL.", function () {
                    expect(ref.getBinaryURL()).toBe(baseURL + path);
                });

                describe("resolution", function () {
                    it("should GET the URL as JSON.", function () {
                        spyOn(Ajax, "get").andReturn(new $.Deferred());

                        var promise = ref.get();

                        expect(Ajax.get).toHaveBeenCalledWith({url: ref.getBinaryURL()});
                    });

                    it("should return the response value.", function () {
                        var deferred = new $.Deferred(),
                            response = "12345";
                        spyOn(Ajax, "get").andReturn(deferred);

                        var promise = ref.get();
                        deferred.resolve(response);

                        expect(promise).toHaveResolvedWith(response);
                    });
                });

            });

            describe("with 'bundle path/part' type", function () {
                var ref,
                    path = "x";

                beforeEach(function () {
                    ref = new Reference({
                        bundlePath: path,
                        bundlePart: "y"
                    });
                });

                it("should log an error if trying to calculate binary URL.", function () {
                    spyOn(Logger.prototype, "error");

                    ref.getBinaryURL();

                    expect(Logger.prototype.error).toHaveBeenCalled();
                });

                describe("resolution", function () {

                    beforeEach(function () {
                        Reference.clearCache();
                    });

                    it("should GET the path appended to the base URL as JSON if not cached.", function () {
                        var deferred = new $.Deferred();
                        spyOn(Ajax, "get").andReturn(deferred);

                        var promise = ref.get();
                        deferred.resolve({
                            y: "YYY",
                            z: "ZZZ"
                        });

                        expect(Ajax.get).toHaveBeenCalledWith({url: baseURL + path});
                        expect(promise).toHaveResolvedWith("YYY");
                    });

                    it("should return the cached value if cached.", function () {
                        var deferred = new $.Deferred();
                        spyOn(Ajax, "get").andReturn(deferred);

                        var promise1 = ref.get();
                        deferred.resolve({
                            y: "YYY",
                            z: "ZZZ"
                        });
                        // Create a new reference with the same input, to avoid any caching of get() calls inside the object.
                        var promise2 = new Reference({
                            bundlePath: ref._bundlePath,
                            bundlePart: ref._bundlePart
                        }).get();

                        expect(Ajax.get.callCount).toBe(1);
                        expect(promise2).toHaveResolvedWith("YYY");
                    });

                    it("should return other bundle parts cached from previous response.", function () {
                        var deferred = new $.Deferred();
                        spyOn(Ajax, "get").andReturn(deferred);

                        var promise1 = ref.get();
                        deferred.resolve({
                            y: "YYY",
                            z: "ZZZ"
                        });
                        var promise2 = new Reference({
                            bundlePath: ref._bundlePath,
                            bundlePart: "z"
                        }).get();

                        expect(Ajax.get.callCount).toBe(1);
                        expect(promise2).toHaveResolvedWith("ZZZ");
                    });
                });
            });

            it("resolution as class should instantiate that class.", function () {
                var response = "12345",
                    deferred = Promise.resolved(response),
                    constructorOutput = {};
                spyOn(Ajax, "get").andReturn(deferred);

                function TestClass(input) {
                    expect(input).toBe(response);
                    return constructorOutput;
                }

                var promise = new Reference({
                    resourceURL: "url"
                }).getAs(TestClass);

                expect(promise).toHaveResolvedWith(constructorOutput);
            });

            it("resolution as list should return parsed list.", function () {
                var response = [1, 2, 3],
                    deferred = Promise.resolved(response);
                spyOn(Ajax, "get").andReturn(deferred);

                function parser(x) {
                    return x + 10;
                }

                var promise = new Reference({
                    resourceURL: "url"
                }).getEachWith(parser);

                expect(promise).toHaveResolvedWith([11, 12, 13]);
            });

            it("should log an error if created with an unknown type.", function () {
                spyOn(Logger.prototype, "error");
                var ref = new Reference({});
                expect(Logger.prototype.error).toHaveBeenCalled();
            });
        });
    });