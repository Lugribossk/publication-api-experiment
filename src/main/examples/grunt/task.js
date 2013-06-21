/*global module, require*/
module.exports = function (grunt) {
    "use strict";

    var requirejs = require("requirejs");
    requirejs.config({
        nodeRequire: require
    });

    grunt.registerTask("api-example", "Example Grunt task showing how the API client also works with NodeJS.", function () {
        var done = this.async();

        var apiKey = "2a39a9615b",
            publicationID = grunt.option("publication");

        if (!publicationID) {
            grunt.fail.warn("--publication option must be specified.");

            done(false);
        }

        requirejs(["api/PublicationAPI"], function (PublicationAPI) {
            new PublicationAPI(apiKey).getPublication(publicationID)
                .then(function (publication) {
                    grunt.log.writeln(publication);

                    done();
                });
        });
    });
};