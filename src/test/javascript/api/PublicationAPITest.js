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
            describe("Publication Info service URL", function () {
                it("defaults to HTTP.", function () {
                    var api = new PublicationAPI("1234abcd");

                    expect(api._apiURL).toBe(PublicationAPI.HTTP_URL);
                });

                it("uses HTTPS when on a secure location.", function () {
                    spyOn(Browser, "getWindow").andReturn({
                        location: {
                            protocol: "https:"
                        }
                    });
                    var api = new PublicationAPI("1234abcd");

                    expect(api._apiURL).toBe(PublicationAPI.HTTPS_URL);
                });
            });
        });
    });