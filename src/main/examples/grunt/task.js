/*global module, require*/
module.exports = function (grunt) {
    "use strict";

    var requirejs = require("requirejs");
    requirejs.config({
        nodeRequire: require,
        baseUrl: "."
    });

    grunt.registerTask("api-example", "Example Grunt task showing how the API client also works with NodeJS.", function () {
        var done = this.async();

        var apiKey = "2a39a9615b",
            publicationID = grunt.option("publication");

        if (!publicationID) {
            grunt.fail.warn("--publication option must be specified.");
            done(false);
        }

        requirejs(["target/publicationapi.min.js"], function (PublicationAPI) {
            new PublicationAPI(apiKey).getPublication(publicationID)
                .fail(function () {
                    grunt.fail.warn("Unable to retrieve publication data.");
                    done(false);
                })
                .then(function (publication) {
                    grunt.log.writeln("Publication '" + publication.name + "' has " + publication.numberOfPages + " pages.");
                    done();
                });
        });
    });
};