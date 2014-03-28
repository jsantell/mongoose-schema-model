var _ = require("underscore");
var defaults = require("./lib/defaults");
var validation = require("./lib/validation");
var executeSchema = require("./lib/schemas").executeSchema;

module.exports = function validate (schemas, options) {
  options = _.extend({}, options || {}, defaults);

  return function (properties) {
    properties = properties || {};

    // An array of the `properties` keys
    var propsList = _.keys(properties);

    // Results object to store any modifications done to the values
    // for each property to be returned on success
    var results = {};

    // Evaluate each property
    for (var i = 0; i < propsList.length; i++) {
      var property = propsList[i];
      var schema = schemas[property];
      var value = properties[property];

      if (options.mustDefine && !schema)
        return property + " is not defined in schema.";

      if (validation.validateType(schema, value))
        return "Expected " + value + " to be a " + typeName(schema.type);

      // `response` is an object with a `value` and an `error`. `value` means it
      // was succesfully passed and is the value of the new formatted value; `error`
      // is a string message of the validation error.
      var response = executeSchema(schema, property, value);
      if (response.error)
        return response.error;
      else
        results[property] = response.value;
    }
    
    // If no errors found, return the mapped results with new values.
    return results;
  };
}
