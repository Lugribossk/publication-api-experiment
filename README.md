Publication API experiment
==========================

### Coding conventions
- Properties that start with an underscore are private.
- Properties are read-only from outside the class unless specified otherwise.
- Properties, parameters and return values are non-null unless specified otherwise.

### JSLint settings
- Tolerate: plusplus, vars, nomen
- Predefined variables: define

### RequireJS
- TODO

### Deferreds/promises
- This project makes heavy use of jQuery [Deferreds](http://api.jquery.com/category/deferred-object/) (aka. "promises" or "futures") to handle the asynchronous nature
  of the Publication API's "references".
- Note that the jQuery documentation for Deferred#then() is completely wrong. It is actually identical to Deferred#pipe().
- Functions that return promises should document the type of the data the promise resolves with.
- Promises are assumed to fail if the requested object could not be found, rather then resolve with null data.

### Other notes
- Constructors explicitly copy properties from their data object parameter. This could be replaced with a
  simple $.extend(this, data) but then it is quite cryptic which properties the class actually has. It also makes it
  possible to turn internal descriptor references into private variables.
- Functions that rely on references or parsing re-do the same work every time they are called.
  An obvious optimization would be to cache the result and delete the data it was generated from.