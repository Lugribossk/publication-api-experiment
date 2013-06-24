define(["jquery"],
    function ($) {
        "use strict";

        $.Deferred.when = $.when;

        return $.Deferred;
    });
