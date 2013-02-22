/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jslint: {
            files: ["grunt.js", "src/main/javascript/**/*.js", "src/main/examples/**/*.js"],
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
                dest: "target/docs",
                options: {
                    "ignore-global": "",
                    "eg-iframe": "jsduck/jsduck-iframe.html",
                    "title": "Publication API Example",
                    //"welcome": "jsduck/jsduck-welcome.html",
                    //"footer": "blah",
                    "external": ["jQuery", "Deferred"]
                }
            }
        },
        testacular: {
            unit: {
                configFile: "testacular.conf.js"
            }/*,
            ci: {
                configFile: "testacular.conf.js",
                singleRun: true,
                browsers: ["PhantomJS"]
            }*/
        }
    });

    grunt.loadNpmTasks("grunt-jslint");
    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-jsduck");
    grunt.loadNpmTasks("gruntacular");

    grunt.registerTask("default", "jslint requirejs");
};