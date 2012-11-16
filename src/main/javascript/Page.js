define(["jquery"],
    function ($) {
        "use strict";

        function Page(data) {
            $.extend(this, data);
        }

        return Page;
    });