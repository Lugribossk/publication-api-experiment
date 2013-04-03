    // Fake jQuery module that returns the global variable.
    // This seems to be the only way to have the code depend on jQuery without bundling it.
    define("jquery", [], function () {
        if (!window.$) {
            throw new Error("PublicationAPI could not find jQuery. It must be set up as a shim dependency or included in a script tag before this.");
        }
        return window.$;
    });

    return require("api/PublicationAPI");
}));