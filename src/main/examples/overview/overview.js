/*global require*/
/**
 * Simple demo of how the Publication API can be used to get and show publication content.
 *
 * @author Bo Gotthardt
 */
require(["jquery", "api/CustomerAPI"],
    function ($, CustomerAPI) {
        "use strict";

        var apiKey = "2a39a9615b",
            customerID = "85d291bd";

        new CustomerAPI(apiKey).getAllPublications(customerID)
            .progress(function (data, progress) {
                $("#loading-bar").width(progress * 100 + "%");
            })
            .then(function (publications) {
                $("#loading-indicator").hide();
                if (publications.length === 0) {
                    $("#no-publications").show();
                    return;
                }
                $("#publications").show();


                publications.forEach(function (publication) {

                    var row = $("<tr><td>" + publication.id + "</td>" +
                        "<td>" + publication.name + "</td>" +
                        "<td>" + publication.numberOfPages + "</td>" +
                        "<td class='enrichments'></td>" +
                        "<td><a href='http://viewer.zmags.com/publication/" + publication.id + "' target='_blank' class='btn btn-mini btn-success'>View</a></td></tr>")
                        .appendTo("#publications tbody");

                    publication.getEnrichments().then(function (enrichments) {
                        row.find(".enrichments").text(enrichments.length);
                    });
                });

            });
    });
