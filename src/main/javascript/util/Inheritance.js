define(["jquery"],
    function ($) {
        "use strict";

        /**
         * Inheritance setup helper class.
         *
         * @class Inheritance
         * @author Bo Gotthardt
         */
        function Inheritance() {
        }

        /**
         * Add a function to the specified class to allow it to be easily subclassed.
         *
         * @param {Function} SuperClass The superclass constructor function.
         */
        Inheritance.makeExtensible = function (SuperClass) {
            /**
             * Declare that the specified subclass extends this class.
             *
             * @param {Function} SubClass The subclass constructor function.
             */
            SuperClass.extendedBy = function (SubClass) {
                // Create a temporary class that we can assign SuperClass' prototype to.
                function Temp() {
                    // Set constructor function reference.
                    this.constructor = SubClass;
                }
                Temp.prototype = SuperClass.prototype;

                // Then use that to set SubClass' prototype.
                // If we instead tried to use new SuperClass() directly, it would break if that constructor had required
                // arguments (e.g. objects it tries to access properties on).
                SubClass.prototype = new Temp();
            };
        };

        return Inheritance;
    });