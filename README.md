Publication API experiment
==========================

An experiment in constructing a client for the Zmags Publication API from scratch, using just the public documentation.

Includes a simple diagnostic-style view of the various elements of a publication, in order to illustrate how the data can be visualized.
Note that while this superficially resembles the viewer webapp, it is very far from it in functionality.

## Getting started

Open [src/main/example/simple.html](src/main/example/simple.html) or start reading [src/main/example/simple.js](src/main/example/simple.js).

## Technical notes

### Coding conventions
- Properties that start with an underscore are private.
- Properties are read-only from outside the class unless specified otherwise.
- Properties, parameters and return values are non-null unless specified otherwise.

### JSLint settings
- Tolerate: plusplus, vars, nomen
- Predefined variables: define

### RequireJS and classes
- RequireJS is used to split each class into its own file, and to have classes depend on each other without polluting the global namespace.
- Each RequireJS module returns a typed class constructor function, rather than a raw object where one of its properties is the class constructor.

### Deferreds/promises
- This project makes heavy use of jQuery [Deferreds](http://api.jquery.com/category/deferred-object/) (aka. "promises" or "futures") to handle the asynchronous nature
  of the Publication API's references.
- Functions that return promises should document the type of the data the promise resolves with.
- Promises are assumed to fail if the requested object could not be found, rather then resolve with null data.

### JSDuck
[JSDuck](https://github.com/senchalabs/jsduck) is used to generate documentation. It's designed for code using Sencha's frameworks but can be made to work pretty well with some extra tags:
- @constructor after the class description but before the parameters makes the constructor function show up in the documentation.
- @private and @static on all methods that are that, even though it is obvious.
- The live examples work due to a new live example iframe with RequireJS.

### Browser compatibility
- The [jQuery-ajaxTransport-XDomainRequest](https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest) plugin is used to enable non-JSONP cross-domain requests in IE 8 and 9.
- For it to work reliably it seems that:
   - dataType must be set to "json" explicitly for it to activate.
   - timeout may be required for requests to not silently disappear without succeeding or failing.
- [es5-shim and es5-sham](https://github.com/kriskowal/es5-shim) are used to enable ES5 functionality in IE 8 and PhantomJS (it's missing Function.prototype.bind()).
- These are set up as dependencies of the BrowserCompatibility class, which is set up as a dependency in the Logger class and test-main. This should cause it to always be loaded first when using the API classes or running tests.

### Other
- Constructors explicitly copy properties from their data object parameter. This could be replaced with a
  simple $.extend(this, data) but then it would be quite cryptic which properties the class actually has. It also makes it
  possible to turn internal descriptor references into private variables.
- Functions that rely on references or parsing re-do the same work every time they are called.
  An obvious optimization would be to parse on creation and cache the result of references and delete the data they were generated from.
  However that would make it less clear what data is retrieved from the API, and what is constructed by post-processing afterwards.