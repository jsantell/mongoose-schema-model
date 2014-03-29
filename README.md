# mongoose-schema-model

[![browser support](https://ci.testling.com/jsantell/mongoose-schema-model.png)](https://ci.testling.com/jsantell/mongoose-schema-model)

[![Build Status](https://travis-ci.org/jsantell/mongoose-schema-model.png)](https://travis-ci.org/jsantell/mongoose-schema-model)

Small model definitions (MongooseDB style) for composable use in other environments.

* Share the same model definitions from MongooseDB on the server with your client
* Use to apply transformations getters/setters between client and REST API (casting form strings as numbers, etc.)
* Shared validations in server/client

## Install

Currently only in npm as commonjs.

`npm install mongoose-schema-model`

## Usage

Using a [Mongoose Schema](http://mongoosejs.com/docs/guide.html) definition, apply getter and setter transformations and validation.

```javascript

// Declare a schema definition

var Model = require("mongoose-schema-model");

function numberCast (x) { return ~~x; }
function split (x) { return x.split(', '); }

var definitions = {
  year: { type: Number, min: 1900, max: 2014, set: numberCast },
  items: { type: [String], lowercase: true, get: split },

};

var model = Model(definitions);

// `get` applies the `get` transformation
model.get("items", ["hello", "world"]); // "hello, world"

// `set` applies all implicit and `set` transformations, as well as subsequently validating
// the model, post-transform.
var response = model.set("items", ["HELLO", "WORLD"]);
response.value; // `["hello", "world"]`, the implicit `lowercase` transform was applied to each element
response.error; // null

response = model.set("year", "2000"); 
response.value; // `2000`, transforms applied via `set`
response.error ; // null

response = model.set("year", "1550"); 
response.value; // `2000`, transforms applied, via `set`
response.error; // "Path `year` (1550) is less than the minimum allowed value (1900)."
```

## Supported Types

* `Number`
* `String`
* `[Number]`
* `[String]`

## Supported Properties

### Transforms

* [set](http://mongoosejs.com/docs/api.html#schematype_SchemaType-set)
* [get](http://mongoosejs.com/docs/api.html#schematype_SchemaType-get)
* [uppercase](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-uppercase) (String-types)
* [lowercase](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-lowercase) (String-types)
* [trim](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-trim)

### Validations

* [required](http://mongoosejs.com/docs/api.html#schematype_SchemaType-required)
* [validate](http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate)
* [enum](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-enum) (String-types)
* [match](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-match) (String-types)
* [max](http://mongoosejs.com/docs/api.html#schema_number_SchemaNumber-max) (Number-types)
* [min](http://mongoosejs.com/docs/api.html#schema_number_SchemaNumber-min) (Number-types)

## License

MIT License
