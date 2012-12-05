/*global requirejs*/
/**
 * Main method for Publication API experiment.
 */
requirejs.config({
    paths: {
        jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min"
    }
});

requirejs(["jquery", "api/PublicationAPI"],
    function ($, PublicationAPI) {
        "use strict";

        var key = "2a39a9615b",
            publicationID = "952ac7ea";

        var api = new PublicationAPI(key);

        api.getPublication(publicationID)
            .done(function (publication) {
                publication.createDomElement({width: 700, height: 700}).appendTo("body");
            });
    });
