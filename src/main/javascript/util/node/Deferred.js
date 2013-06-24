define(["util/node/node-require"], function (nodeRequire) {
    "use strict";

    var $ = nodeRequire("jquery-deferred");

    $.Deferred.when = $.when;

    return $.Deferred;
});
