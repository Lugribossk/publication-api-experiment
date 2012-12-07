/*global requirejs*/
/**
 * Simple Publication API demo.
 *
 * @author Bo Gotthardt
 */
requirejs.config({
    baseUrl: "../../javascript",
    paths: {
        jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min"
    }
});

requirejs(["api/PublicationAPI"],
    function (PublicationAPI) {
        "use strict";

        var key = "2a39a9615b",
            publicationID = "952ac7ea";

        new PublicationAPI(key).getPublication(publicationID)
            .done(function (publication) {
                publication.createDomElement({width: 700, height: 700})
                    .appendTo("body");
            });
    });
