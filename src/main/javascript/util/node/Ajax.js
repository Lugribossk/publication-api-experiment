define(["util/node/node-require"], function (nodeRequire) {
    "use strict";
    var najax = nodeRequire("najax");

    function Ajax() {}

    /**
     * GET data from a server.
     *
     * @static
     *
     * @param {Object} settings Object with request settings such as URL and parameters.
     * @return {Promise} A promise for the response data.
     */
    Ajax.get = function (settings) {
        // Seems to need this to be set explicitly or it will return a string instead of an object.
        settings.dataType = "json";
        return najax(settings).promise();
    };

    return Ajax;
});
