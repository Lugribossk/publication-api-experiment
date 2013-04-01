Publication API example
==========================

Example code for interacting with the Zmags Publication API.

## Examples

### Simple
Simple demo of how the Publication API can be used to get and show publication content. Note that while this superficially resembles the viewer webapp, it is very far from it in functionality.

[Demo](http://lugribossk.github.com/publication-api-experiment/src/main/examples/simple/simple.html), [Code](src/main/examples/simple/simple.js).

### Archive
Viewer with archive sidebar using a combination of the Viewer API and Publication API.

[Demo](http://lugribossk.github.com/publication-api-experiment/src/main/examples/archive/archive.html), [Code](src/main/examples/archive/archive.js).

### Publications overview
List of all the *activated* publications on an account, including their ID and link to view them.

[Demo](http://lugribossk.github.com/publication-api-experiment/src/main/examples/overview/overview.html), [Code](src/main/examples/overview/overview.js).

## Documentation
[Class documentation](http://lugribossk.github.com/publication-api-experiment/docs/index.html), autogenerated with [JSDuck](https://github.com/senchalabs/jsduck).

## Using as library
Create a single file with all the classes namespaced under "publicationapi" with `grunt library`.

## Unit tests
Start server with `grunt karma`, run tests with `grunt karma:unit:run`

Continuous integration with `grunt karma:ci`

### Travis CI
[![Build Status](https://travis-ci.org/Lugribossk/publication-api-experiment.png?branch=master)](https://travis-ci.org/Lugribossk/publication-api-experiment)

### Windows environment variables
`PHANTOMJS_BIN=node_modules\phantomjs\lib\phantom\phantomjs.exe`

`CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

## Technical notes

### Coding conventions
- Properties that start with an underscore are private.
- Properties are read-only from outside the class unless specified otherwise.
- Properties, parameters and return values are non-null unless specified otherwise.

### JSLint settings
- Tolerate: `plusplus`, `vars`, `nomen`, `todo`
- Predefined variables: `define`

### RequireJS and classes
- RequireJS is used to split each class into its own file, and to have classes depend on each other without polluting the global namespace.
- Each RequireJS module returns a typed class constructor function, rather than a raw object where one of its properties is the class constructor.

### Deferreds/promises
- This project makes heavy use of jQuery [Deferreds](http://api.jquery.com/category/deferred-object/) (aka. "promises" or "futures") to handle the asynchronous nature
  of the Publication API's references.
- Functions that return promises should document the type of the data the promise resolves with.
- Promises are assumed to fail if the requested object could not be found, rather then resolve with null data.

### JSDuck
- [JSDuck](https://github.com/senchalabs/jsduck) is used to generate documentation. It's designed for code using Sencha's frameworks but can be made to work pretty well with some extra tags.
- `@constructor` after the class description but before the parameters makes the constructor function show up in the documentation.
- `@private` and `@static` on all methods that are that, even though it is obvious.
- The live examples work due to a new live example iframe with RequireJS.

### Browser compatibility
- The [jQuery-ajaxTransport-XDomainRequest](https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest) plugin is used to enable non-JSONP cross-domain requests in IE 8 and 9.
- For it to work reliably it seems that:
   - dataType must be set to "json" explicitly for it to activate.
   - timeout may be required for requests to not silently disappear without succeeding or failing.
- [es5-shim and es5-sham](https://github.com/kriskowal/es5-shim) are used to enable ES5 functionality in IE 8 and PhantomJS (it's missing Function.prototype.bind).
- These are set up as dependencies of the `Ajax` and `ES5` classes. ES5 is set up as a dependency in the Logger class and test-main. This should cause it to always be loaded first when using the API classes or running tests.

### Other
- Constructors explicitly copy properties from their data object parameter. This could be replaced with a
  simple $.extend(this, data) but then it would be quite cryptic which properties the class actually has. It also makes it
  possible to turn internal descriptor references into private variables.
- Functions that rely on references or parsing re-do the same work every time they are called.
  An obvious optimization would be to parse on creation and cache the result of references and delete the data they were generated from.
  However that would make it less clear what data is retrieved from the API, and what is constructed by post-processing afterwards.
- "Views" (i.e. functions that generate DOM elements to visualize the various classes) have been split into their own files. On load, these add the functions to the prototype of their associated classes. This lets them stay out of the model objects if not needed, and avoids having them as completely separate classes.

## References
[Viewer API documentation](http://documentation.zmags.com/viewercommonapi/index.html)


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/d0f7ee2f59e42083370a5e8e5e9519fa "githalytics.com")](http://githalytics.com/Lugribossk/publication-api-experiment)