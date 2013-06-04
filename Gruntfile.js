/*global module*/
module.exports = function (grunt) {
    "use strict";

    var jsFiles = ["src/main/javascript/**/*.js",
        "src/test/javascript/**/*.js",
        "src/main/examples/**/*.js",
        "Gruntfile.js",
        "package.json"];

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                ignores: ["src/main/javascript/lib/*.js"]
            },
            all: {
                src: jsFiles
            },
            ci: {
                src: jsFiles,
                options: {
                    reporter: "checkstyle",
                    reporterOutput: "target/jshint.xml"
                }
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

    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-jsduck");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("default", ["jshint:all", "requirejs:library"]);
    grunt.registerTask("travis", ["karma:ci", "jshint:all", "requirejs:library"]);
};