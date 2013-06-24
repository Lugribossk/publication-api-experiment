define(["util/node/node-require", "util/Deferred"], function (nodeRequire, Deferred) {
    "use strict";
    var request = nodeRequire("request");

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
        var deferred = new Deferred();

        request({
            url: settings.url,
            qs: settings.data,
            timeout: settings.timeout,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                deferred.resolve(body);
            } else {
                deferred.reject();
            }
        });

        return deferred.promise();
    };

    return Ajax;
});