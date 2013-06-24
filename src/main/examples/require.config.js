/**
 * RequireJS module setup.
 */
var require = {
    baseUrl: "../../javascript",
    paths: {
        jquery: "http://code.jquery.com/jquery-1.10.1.min",
        node: "util/node/node"
    },
    map: {
        "*": {
            "is": "lib/require-is/is"
        }
    }
};