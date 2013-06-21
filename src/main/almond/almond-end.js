    // Ending part of the Almond wrapper. Note that this code is part of the factory function, so it defines and requires
    // modules from this project, rather than the page the script is running inside.

    // Fake jQuery module that returns the definition from the outside module, or the global variable.
    // This seems to be the only way to have the code depend on jQuery without bundling it.
    define("jquery", [], function () {
        if (jQueryOrNodeRequire) {
            // Use jQuery passed as a dependency.
            return jQueryOrNodeRequire;
        }

        if (typeof $ !== "undefined" && $.support) {
            // Use jQuery defined as a global variable.
            // Hopefully only jQuery will have a "support" property on the global $ variable.
            return $;
        }

        throw new Error("PublicationAPI could not find jQuery. It must be defined as a module or included in a script tag before this.");
    });

    // Fake module to pass the Node require function to where it is needed, without interfering with Almond.
    // Our modules can't simply depend on the "requirejs" module, as that has not been set up in the context Almond runs in.
    define("util/node/node-require", [], function () {
        return jQueryOrNodeRequire;
    });

    return require("api/PublicationAPI");
}));