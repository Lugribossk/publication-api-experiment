/*global process*/
define([], function () {
    "use strict";

    /**
     * Module for detecting whether we're running in NodeJS.
     * Intended to be used together with the "is" plugin.
     *
     * See https://groups.google.com/forum/#!topic/nodejs/IB1jFzWEse8
     *
     * @author Bo Gotthardt
     */
    return typeof process !== "undefined" && process.versions && !!process.version.node;
});