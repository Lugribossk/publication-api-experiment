/*global requirejs*/
/**
 * Main method for Publication API experiment.
 */
requirejs.config({
    paths: {
        jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min"
    }
});

requirejs(["jquery", "PublicationAPI"],
    function ($, PublicationAPI) {
        "use strict";

        var key = "715f663c48",
            pubId = "8c628bfc";

        var api = new PublicationAPI(key);

        api.getPublication(pubId)
            .done(function (publication) {
                console.log(publication);

                publication.getPage(1)
                    .done(function (page) {
                        page.getEnrichments()
                            .done(function (enrs) {
                                console.log(enrs);
                            });
                    });
            });
    });