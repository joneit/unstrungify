# unstrungify
Walk a hierarchical object as JSON.stringify does but without serializing.

### Synopsis

```javascript
unstrungify.call(object, preserve)
```

where:
* `object` is the context (the `this` value), which is the object to be walked
* `preserve` is an optional boolean (defaults to `false`)

### Usage

```javascript
var unstrungify = require('unstrungify');
function myAPI() { /* ... */ };
myAPI.prototype.getState = unstrungify;
var instance = new myAPI();
var state = instance.getState();
```

or without an API:

```javascript
var unstrungify = require('unstrungify');
var myObject = { /* ... */ };
var state = unstrungify.call(myObject);
```

### Description

Recursively walks the object tree.

For each node:
* calls `.toJSON()` when available (see below)
* Otherwise clones the node

Returns a new object representing the context object.

Functionally identical to `JSON.parse(JSON.stringify(this))` but far more efficient because it skips the serialization and parse steps.

### What the heck is this `toJSON`?

Learn more about `JSON.stringify()`'s [toJSON behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior).

### Undefined array elements

When precise index position in arrays is important, call with truthy `preserve` parameter.

### Cross-frame scripting caveat!

This function comes with its own `unstrungify.isArray()` which is very fast but does not work for cross-frame scripting. In that case you can use the following (much slower) function:

```javascript
unstrungify.isArray = unstrungify.crossFramesIsArray;
```

Or, if you have jQuery loaded, you might use it's (reasonably fast) duck typing function:

```javascript
unstrungify.isArray = jQuery.isArray;
```

If you are not doing any cross-frame scripting and speed is not an issue, you don't need this.
