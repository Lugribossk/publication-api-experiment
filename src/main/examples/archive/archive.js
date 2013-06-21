/*global require, window*/
/**
 * Viewer with archive sidebar using a combination of the Viewer API and Publication API.
 *
 * Features:
 * - Displays an archive of several other publications next to the current publication.
 * - Clicking on these switches to that publication.
 * - Custom links can be used to deeplink to pages between the different publications. E.g. {type=archive&id=1234abcd&page=10}.
 * - The URL changes to indicate the current publication and page, and also shares this.
 * - The sidebar is styled with a simple Verge-like theme.
 *
 * Note that it must be loaded from a proper domain, as the Flash view will not start if loaded from a file:// URL.
 *
 * @author Bo Gotthardt
 */
require(["jquery", "api/PublicationAPI", "util/Promise", "http://api.viewer.zmags.com/viewer/viewer.js", "util/ES5"],
    function ($, PublicationAPI, Promise, Viewer, ES5) {
        "use strict";
        var currentPublicationID = null;

        /**
         * Handle the page being changed in the viewer.
         *
         * @param {Viewer} viewer
         * @param {Number} page
         */
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
            $("#publication-" + currentPublicationID).addClass("current");

            // Remove the viewer for the previous publication.
            $("#viewer").empty();

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
                    displayPublication(data.id, data.page || 1);
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
        // getPublications(["8d738def", "88f2a97d", "a850b17d"])
        var apiKey = "2a39a9615b";
        var customerID = "85d291bd";

        new PublicationAPI(apiKey).getAllPublications(customerID)
            .then(function (publications) {
                // Sort publications alphabetically.
                publications.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                // If we're not already displaying a publication (from the hash fragment), default to the first one.
                if (!currentPublicationID) {
                    displayPublication(publications[0].id);
                }

                // Create a cover page element for each publication.
                var coverPageElements = publications.map(function (publication) {
                    return publication.getPage(1)
                        .then(function (page) {
                            // We only need an image of the cover page (and not all the enrichment data),
                            // so use the page representation instead, which is just an image of the page.
                            return $("<img/>", {
                                src: page.getClosestRepresentation({width: 200, height: 200}).getImageURL(),
                                "class": "PageRepresentation",
                                title: publication.name,
                                id: "publication-" + publication.id
                            })
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

                $("#publication-" + currentPublicationID).addClass("current");
            });
    });
