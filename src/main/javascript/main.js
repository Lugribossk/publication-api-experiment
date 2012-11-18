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
//            pubId = "8c628bfc";
            pubId = "48040223";

        var api = new PublicationAPI(key, "http://api-viewer-test.zmags.com/publication/");

        api.getPublication(pubId)
            .then(function (publication) {
                return publication.getPages();
            })
            .done(function (pages) {
                $.each(pages, function (i, page) {
                    page.createDomElement({width: 500}).appendTo("body");
                });
            });

//        api.getPublication(pubId)
//            .done(function (publication) {
//                console.log(publication);
//
//                publication.getPage(1)
//                    .done(function (page) {
////                        page.getEnrichments()
////                            .done(function (enrs) {
////                                console.log(enrs);
////                                window.enrs = enrs
////                            });
//                        window.page = page;
//                        page.createDomElement({width: 500, height: 500}).appendTo("body")
//
////                        var x = require("shape/PolygonShape")
////                        var y = new x({coordinates: [{x:0.1, y:0.1}, {x:0.5, y:0.5}, {x:0, y:0.9}]})
//////                        var y = new x({coordinates: [{x:10, y:10}, {x:50, y:50}, {x:0, y:90}]})
////                        y.createDomElement().appendTo("#blah")
//                    });
//            });
    });