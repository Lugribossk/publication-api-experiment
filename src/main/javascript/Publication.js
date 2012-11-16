define(["jquery", "PublicationAPI", "Reference"],
    function ($, APIClient, Reference) {
        "use strict";

        /**
         * A Zmags publication.
         *
         * Note: This constructor is private and will not create a useful object.
         * Instead use {@link PublicationAPI#getPublication()}.
         *
         * @param {String} id The publication ID
         * @class Publication
         */
        function Publication(id) {
            this.id = id;
        }

//        Publication.prototype.getPage = function (pageNumber) {
//            initPageDescriptorMap(this);
//
//
//        }

        return Publication;
    });