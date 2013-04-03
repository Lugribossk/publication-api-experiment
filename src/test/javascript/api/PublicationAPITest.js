/*global describe, it, expect, spyOn, beforeEach, afterEach, jasmine*/
/**
 * Tests for {@link PublicationAPI}.
 *
 * @author Bo Gotthardt
 */
define(["jquery", "api/PublicationAPI", "util/Browser"],
    function ($, PublicationAPI, Browser) {
        "use strict";

        describe("PublicationAPI", function () {
            describe("API domain", function () {
                it("should default to HTTP.", function () {
                    spyOn(Browser, "isSecure").andReturn(false);
                    var api = new PublicationAPI("1234abcd");

                    expect(api._apiDomain).toBe(PublicationAPI.DOMAIN);
                });

                it("should use HTTPS when on a secure location.", function () {
                    spyOn(Browser, "isSecure").andReturn(true);
                    var api = new PublicationAPI("1234abcd");

                    expect(api._apiDomain).toBe(PublicationAPI.SECURE_DOMAIN);
                });
            });
        });
    });