/*global console*/
define([],
    function () {
        "use strict";

        function Logger() {}

        Logger.prototype.log = function (msg) {
            console.log("External project Logger class", msg);
        };

        return Logger;
    });