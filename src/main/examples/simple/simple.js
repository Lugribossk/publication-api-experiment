/*global require*/
/**
 * Simple Publication API demo.
 *
 * @author Bo Gotthardt
 */
require(["api/PublicationAPI", "view/SimplePublicationView"],
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
