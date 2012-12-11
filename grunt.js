/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jslint: {
            files: ["src/main/javascript/**/*.js", "src/main/examples/**/*.js"],
            exclude: ["src/main/javascript/lib/*.js"],
            directives: {
                plusplus: true,
                vars: true,
                nomen: true,
                todo: true,
                unparam: true,
                predef: ["define"]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "src/main/javascript",
                    mainConfigFile: "src/main/examples/require.config.js",
                    name: "../examples/simple/simple",
                    out: "target/simple.out.js",
                    logLevel: 1,
                    optimize: "uglify2",
                    preserveLicenseComments: false,
                    generateSourceMaps: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-requirejs');

    grunt.registerTask('default', 'jslint requirejs');
};