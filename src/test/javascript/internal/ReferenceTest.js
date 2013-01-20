/*global describe, it, expect, spyOn*/
/**
 * Tests for {@link Reference}.
 *
 * @author Bo Gotthardt
 */
define(["internal/Reference", "util/Logger"], function (Reference, Logger) {
    "use strict";

    describe("Reference class", function () {
        it("should calculate the binary URL of resourceURL types as the entire value.", function () {

            var x = new Reference({
                resourceURL: "http://www.example.com"
            });
            expect(x.getBinaryURL()).toBe("http://www.example.com");

        });

        it("should log an error when the input does not have a known type.", function () {
            spyOn(Logger.prototype, "error");
            var ref = new Reference({});
            expect(Logger.prototype.error).toHaveBeenCalled();
        });
    });
});