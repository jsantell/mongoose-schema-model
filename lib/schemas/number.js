var _ = require("underscore");
var utils = require("../utils")
var firstOrOnly = utils.firstOrOnly;
var errorMessage = utils.errorMessage;

function min (schema, property, value) {
  var min = firstOrOnly(schema.min);
  if (value < min)
    return errorMessage(schema, property, value, "min");
}

function max (schema, property, value) {
  var max = firstOrOnly(schema.max);
  if (value > max)
    return errorMessage(schema, property, value, "max");
}

module.exports = function NumberSchema (schema, property, value) {
  var values = [].concat(value);
  var error;

  for (var i = 0; i < values.length; i++) {
    if (schema.min && (error = min(schema, property, values[i])))
      return { error:  error };
    if (schema.max && (error = max(schema, property, values[i])))
      return { error:  error };
  }
  return { value: value };
}
