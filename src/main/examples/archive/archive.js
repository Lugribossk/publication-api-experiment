/*global requirejs, window*/
/**
 * Archive demo.
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

requirejs(["jquery", "api/CustomerAPI", "util/Promise", "viewerAPI"],
    function ($, CustomerAPI, Promise, Viewer) {
        "use strict";
        var currentPublication = null;

        function currentPageChanged(viewer, page) {
            window.location.hash = currentPublication + "/" + page;

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
            if (currentPublication === publicationID) {
                return;
            }
            currentPublication = publicationID;
            page = page || 1;

            // Add a class to distinguish the currently selected publication.
            $(".PageRepresentation").removeClass("current");
            $("#" + publicationID).addClass("current");

            // Remove the viewer for the previous publication.
            $("#viewer").children().remove();

            // Use the viewer API to insert the new publication.
            var viewer = new Viewer();
            viewer.setPublicationID(currentPublication);
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

        // Make sure the element with the coverpages has the same pixel height as its container so that it will show scrollbars.
        $(window).on("load resize", function () {
            $("#coverpages").height($("#archive").height());
        });

        // Get all the activated publications the customer has.
        var key = "2a39a9615b";
        var customerID = "85d291bd";
        new CustomerAPI(key).getPublications(customerID)
            .then(function (publications) {
                // Sort publications alphabetically.
                publications.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                // Create a archive object for each publication with the object and first page.
                var archives = publications.map(function (publication) {
                    return publication.getPage(1)
                        .then(function (coverPage) {
                            return {
                                publication: publication,
                                // We only need an image of the cover page (and not all the enrichment data),
                                // so use the page representation instead, which is just an image of the page.
                                coverPage: coverPage.getClosestRepresentation({width: 200, height: 200})
                            };
                        });
                });
                return Promise.all(archives);
            })
            .then(function (archives) {
                // Turn each coverpage into an element that can be clicked.
                archives.forEach(function (archive) {
                    archive.coverPage.createDomElement()
                        .attr("title", archive.publication.name)
                        .attr("id", archive.publication.id)
                        .on("click", function () {
                            // Display the clicked publication.
                            displayPublication(archive.publication.id);
                        })
                        .appendTo("#coverpages");
                });

                // If we're not already displaying a publication (from the hash fragment), default to the first one.
                if (!currentPublication) {
                    displayPublication(archives[0].publication.id);
                }
            });
    });
