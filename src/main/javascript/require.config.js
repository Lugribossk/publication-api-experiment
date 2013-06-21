/*global require*/
require.config({
    paths: {
        jquery: "http://code.jquery.com/jquery-1.10.1.min",

        node: "util/node/node"
    },
    map: {
        "*": {
            "is": "lib/require-is/is"
        }
    },
    exclude: ["util/node/node-require"]
});