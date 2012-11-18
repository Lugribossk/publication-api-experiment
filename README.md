Publication API experiment
==========================

### Coding conventions
- Properties that start with an underscore are private.
- Properties are read-only unless specified otherwise.
- Properties, parameters and return values are non-null unless specified otherwise.

### JSLint settings
- Tolerate: plusplus, vars, nomen.
- Predefined variables: define

### RequireJS
- TODO

### Deferreds
- This project makes heavy use of jQuery [Deferreds](http://api.jquery.com/category/deferred-object/) (aka. "promises" or "futures") to handle the asynchronous nature
  of the Publication API's "references".
- Note that the jQuery documentation for Deferred#then() is completely wrong. It is actually identical to Deferred#pipe().


### Inheritance implementation
#### Subclasses:
- Call the superclass constructor with SuperClass.call(this, parameters...) at the top of their own constructor.
- Set SubClass.prototype = new SuperClass().
- Call superclass instance methods with SuperClass.prototype.methodName.call(this, parameters...).

#### Superclasses:
- Immediately return in their constructor if no arguments are given. This is a requirement due to point #2 above.


### Other notes
- Constructors explicitly copy properties from their data object parameter. This could be replaced with a
  simple $.extend(this, data) but then it is quite cryptic which properties the class actually has. It also makes it
  possible to turn internal descriptor references into private variables.