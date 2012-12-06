Publication API experiment
==========================

An experiment in constructing a client for the Zmags Publication API from scratch, using just the public documentation.

Includes a simple diagnostic-style view of the various elements of a publication, in order to illustrate how the data can be visualized.
Note that while this superficially resembles the viewer webapp, it is very far from it in functionality.

## Getting started

Open `src/main/javascript/example.html` or start reading `src/main/javascript/example.js`.

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
- Each RequireJS module returns a typed class as its constructor function, rather than a raw object where one of its properties is the class.

### Deferreds/promises
- This project makes heavy use of jQuery [Deferreds](http://api.jquery.com/category/deferred-object/) (aka. "promises" or "futures") to handle the asynchronous nature
  of the Publication API's references.
- Note that the jQuery documentation for Deferred#then is completely wrong. It is actually identical to Deferred#pipe.
- Functions that return promises should document the type of the data the promise resolves with.
- Promises are assumed to fail if the requested object could not be found, rather then resolve with null data.

### JSDuck
[JSDuck](https://github.com/senchalabs/jsduck) is used to generate documentation. It's designed for code using Sencha's frameworks but can be made to with pretty well with some extra tags:
- @constructor after the class description but before the parameters makes the constructor function show up in the documentation.
- @private and @static on all methods that are that, even though it is obvious.
- The live examples work due to a new live example iframe with RequireJS.
- @class namespace.ClassName and @alternativeClassName ClassName seem to both allow the class to be referenced with it's short name, and be grouped under the namespace.

### Other
- Constructors explicitly copy properties from their data object parameter. This could be replaced with a
  simple $.extend(this, data) but then it would be quite cryptic which properties the class actually has. It also makes it
  possible to turn internal descriptor references into private variables.
- Functions that rely on references or parsing re-do the same work every time they are called.
  An obvious optimization would be to parse on creation and cache the result of references and delete the data they were generated from.
  However that would make it less clear what data is retrieved from the API, and what is constructed by post-processing afterwards.