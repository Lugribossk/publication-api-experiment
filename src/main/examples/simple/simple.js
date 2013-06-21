/*global require*/
/**
 * Simple demo of how the Publication API can be used to get and show publication content.
 *
 * @author Bo Gotthardt
 */
require(["api/PublicationAPI", "view/SimplePublicationView", "util/ES5"],
    function (PublicationAPI, SimplePublicationView, ES5) {
        "use strict";

        var apiKey = "2a39a9615b",
            publicationID = "952ac7ea";

        new PublicationAPI(apiKey).getPublication(publicationID)
            .done(function (publication) {
                publication.createDomElement({width: 700, height: 700})
                    .appendTo("body");
            });
    });
