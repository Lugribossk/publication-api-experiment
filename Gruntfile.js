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
        testacular: {
            options: {
                configFile: "testacular.conf.js"
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
    grunt.loadNpmTasks("gruntacular");

    grunt.registerTask("default", ["jslint", "requirejs"]);
    grunt.registerTask("travis", ["testacular:ci", "jslint"]);
};