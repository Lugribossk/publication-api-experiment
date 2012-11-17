define(["jquery", "Reference", "Page"],
    function ($, Reference, Page) {
        "use strict";

        /**
         * A Zmags publication.
         *
         * Note: This constructor is private and will not create a useful object.
         * Instead use {@link PublicationAPI#getPublication()}.
         *
         * @param {String} id The publication ID
         *
         * @class Publication
         * @author Bo Gotthardt
         */
        function Publication(id) {
            this.id = id;
        }

        /**
         * Get the specified page.
         *
         * @param {Number} pageNumber The page number, starts at <b>1</b>.
         * @return {$.Deferred} A deferred that resolves with the page
         */
        Publication.prototype.getPage = function (pageNumber) {
            // The pageDescriptors array has the pages in sorted order.
            return new Reference(this.pageDescriptors[pageNumber - 1]).getAs(Page);
        };

        return Publication;
    });