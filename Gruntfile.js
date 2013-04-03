/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jslint: {
            files: ["src/main/javascript/**/*.js",
                    "src/test/javascript/**/*.js",
                    "src/main/examples/**/*.js",
                    "Gruntfile.js",
                    "package.json"],
            exclude: ["src/main/javascript/lib/*.js"],
            directives: {
                plusplus: true,
                vars: true,
                nomen: true,
                todo: true,
                predef: ["define"]
            },
            options: {
                checkstyle: "target/jslint.xml"
            }
        },
        requirejs: {
            options: {
                baseUrl: "src/main/javascript",
                mainConfigFile: "src/main/examples/require.config.js",
                logLevel: 1,
                optimize: "uglify2",
                preserveLicenseComments: false,
                generateSourceMaps: true
            },
            compile: {
                options: {
                    name: "../examples/simple/simple",
                    out: "target/simple.out.js"
                }
            },
            library: {
                options: {
                    almond: true,
                    wrap: {
                        startFile: "src/main/almond/almond-start.js",
                        endFile: "src/main/almond/almond-end.js"
                    },
                    include: ["api/PublicationAPI"],
                    out: "target/publicationapi.min.js"
                }
            }
        },
        jsduck: {
            main: {
                src: ["src/main/javascript"],
                dest: "docs",
                options: {
                    "ignore-global": "",
                    "eg-iframe": "src/main/jsduck/jsduck-iframe.html",
                    title: "Publication API Example",
                    welcome: "src/main/jsduck/jsduck-welcome.html",
                    footer: ".",
                    external: ["jQuery", "Deferred", "Window"]
                }
            }
        },
        karma: {
            options: {
                configFile: "karma.conf.js"
            },
            unit: {
            },
            ci: {
                singleRun: true,
                reporters: ["progress", "coverage", "junit"],
                browsers: ["PhantomJS"],
                coverageReporter: {
                    type: "cobertura",
                    dir: "target/coverage/"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-jslint");
    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-jsduck");
    grunt.loadNpmTasks("grunt-karma");

    grunt.registerTask("default", ["jslint", "requirejs"]);
    grunt.registerTask("travis", ["karma:ci", "jslint"]);
};