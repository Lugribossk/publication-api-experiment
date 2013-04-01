/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jslint: {
            files: ["src/main/javascript/**/*.js",
                    "src/test/javascript/**/*.js",
                    "src/main/examples/**/*.js",
                    "Gruntfile.js"],
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
                    include: ["api/CustomerAPI", "api/PublicationAPI"],
                    out: "target/publicationapi.min.js",
                    generateSourceMaps: false
                }
            }
        },
        "string-replace": {
            library: {
                files: {
                    "target/publicationapi.min.js": "target/publicationapi.min.js"
                },
                options: {
                    replacements: [{
                        pattern: /"(api|enrichment|internal|lib|publication|shape|util|view)\//g,
                        replacement: "\"publicationapi/$1/"
                    }]
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
    grunt.loadNpmTasks("grunt-string-replace");

    grunt.registerTask("default", ["jslint", "requirejs"]);
    grunt.registerTask("travis", ["karma:ci", "jslint"]);
    grunt.registerTask("library", ["requirejs:library", "string-replace:library"]);
};