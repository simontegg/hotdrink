The documentation of data structures, algorithms, and concepts necessary to develop and extend the HotDrink library is generated from the source code using [JsDoc Toolkit](http://code.google.com/p/jsdoc-toolkit/) and hosted [elsewhere](http://parasol.cs.tamu.edu/groups/pttlgroup/hotdrink/doc/symbols/hotdrink.html).

## Instructions for Authors ##

In the templates below, single brackets (`[...]`) surround optional elements. Ellipses denote either code sections or repeated elements. If there are no instances of a particular element, e.g. no parameters for a function, then it can be omitted.

### Descriptions ###
When writing descriptions, use complete sentences. Break them up into paragraphs if necessary by using HTML (`<p>`). Use `@link` and `@see` tags liberally to link to related entities.

### Files ###
```
/**
 * @fileOverview <p>{@link <qualified path to name defined in this file>}</p>
 * @author <full name>
 */
```

### Namespaces ###
```
/**
 * @name <qualified path to namespace>
 * @namespace <description>
 */
```

### Concepts ###
Concepts typically document class templates by tagging a non-existent class:
```
/**
 * @name <qualified path to concept>
 * @class <description>
 *
 * @constructor
 * @param {<type>} <name> [<description>]
 * ...
 * @description <description>
 *
 * @name <qualified path to concept>#<method name>
 * @function
 * @param {<type>} <name> [<description>]
 * ...
 * @returns {<type>} [<description>]
 * @description <description>
 */
```

Alternatively, concepts can document namespace templates or non-class types by tagging a non-existent [namespace](DeveloperDocumentation#Namespaces.md) (possibly with non-existent [functions](DeveloperDocumentation#Functions.md)).

### Classes ###
```
var ClassName = Class.create(
/** @lends <qualified path to ClassName># */
{ ... }
```

#### Constructors ####
```
/**
 * @param {<type>} <name> [<description>]
 * ...
 * @constructs
 * @class <description>
 * @property {<type>} <name> [<description>]
 * ...
 */
```

#### Methods ####
```
/**
 * <description>
 * @param {<type>} <name> [<description>]
 * ...
 * @returns {<type>} [<description>]
 */
```

### Functions ###
```
/**
 * @name <function name>
 * @memberOf <qualified path to surrounding namespace>
 * @description <description>
 * @public
 * @static
 * @function
 * @param {<type>} <name> [<description>]
 * ...
 * @returns {<type>} [<description>]
 */
```