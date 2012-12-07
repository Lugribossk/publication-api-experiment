/*global requirejs, window*/
/**
 * Archive demo using the Viewer API.
 *
 * @author Bo Gotthardt
 */
requirejs.config({
    baseUrl: "../../javascript",
    paths: {
        jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min",
        viewerAPI: "http://api.viewer.zmags.com/viewer/viewer"
    }
});

requirejs(["jquery", "api/CustomerAPI", "api/PublicationAPI", "util/Promise", "viewerAPI"],
    function ($, CustomerAPI, PublicationAPI, Promise, Viewer) {
        "use strict";
        var currentPublicationID = null;

        function currentPageChanged(viewer, page) {
            window.location.hash = currentPublicationID + "/" + page;

            // Set the viewer to share this website plus the current publication/page, rather than the publication URL itself.
            viewer.setSharePublicationURL(window.location.href);
        }

        /**
         * Display the specified publication.
         *
         * @param {String} publicationID
         * @param {Number} [page=1]
         */
        function displayPublication(publicationID, page) {
            if (currentPublicationID === publicationID) {
                return;
            }
            currentPublicationID = publicationID;
            page = page || 1;

            // Add a class to distinguish the currently selected publication.
            $(".PageRepresentation").removeClass("current");
            $("#" + currentPublicationID).addClass("current");

            // Remove the viewer for the previous publication.
            $("#viewer").children().remove();

            // Use the viewer API to insert the new publication.
            var viewer = new Viewer();
            viewer.setPublicationID(currentPublicationID);
            viewer.setParentElementID("viewer");
            viewer.gotoPage(page);
            viewer.show();

            // Listen for custom link clicks so we can change between publications in the archive.
            viewer.addEventListener(Viewer.CUSTOM_LINK_ACTIVATE, function (event) {
                var data = event.data;
                if (data.type === "archive") {
                    displayPublication(data.id, data.page);
                }
            });

            // Update the hash fragment whenever the page changes.
            viewer.addEventListener(Viewer.CURRENT_PAGES_CHANGE, function (event) {
                currentPageChanged(viewer, event.pages.firstPage);
            });

            // Update the hash fragment with the current page.
            currentPageChanged(viewer, page);
        }

        // Try to get the publication ID and page to display from the hash fragment.
        if (window.location.hash !== "") {
            var hash = window.location.hash.substring(1).split("/");
            displayPublication(hash[0], hash[1]);
        }

        // Get all the activated publications the customer has.
        // If we only wanted some specific ones we could do this instead:
        // new PublicationAPI(key).getPublications(["8d738def", "88f2a97d", "a850b17d"])
        var key = "2a39a9615b";
        var customerID = "85d291bd";
        new CustomerAPI(key).getAllPublications(customerID)
            .then(function (publications) {
                // Sort publications alphabetically.
                publications.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                // If we're not already displaying a publication (from the hash fragment), default to the first one.
                if (!currentPublicationID) {
                    displayPublication(publications[0].id);
                }

                // Create a archive object for each publication with the object and first page.
                var coverPageElements = publications.map(function (publication) {
                    return publication.getPage(1)
                        .then(function (page) {
                            // We only need an image of the cover page (and not all the enrichment data),
                            // so use the page representation instead, which is just an image of the page.
                            return page.getClosestRepresentation({width: 200, height: 200}).createDomElement()
                                .attr("title", publication.name)
                                .attr("id", publication.id)
                                .on("click", function () {
                                    // Display the clicked publication.
                                    displayPublication(publication.id);
                                });
                        });
                });
                return Promise.all(coverPageElements);
            })
            .then(function (coverPageElements) {
                // Place each element on the page.
                // We're doing this here rather than above as the list we get here is in sorted other, while the
                // individual promises generated by publication.getPage() can resolve in any order.
                coverPageElements.forEach(function (element) {
                    element.appendTo("#coverpages");
                });

                $("#" + currentPublicationID).addClass("current");
            });
    });
