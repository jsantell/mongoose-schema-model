var _ = require("underscore");
var utils = require("../utils");
var firstOrOnly = utils.firstOrOnly;
var errorMessage = utils.errorMessage;

function min (schema, property, value) {
  var minVal = firstOrOnly(schema.min);
  if (value < minVal)
    return errorMessage(schema, property, value, "min");
}

function max (schema, property, value) {
  var maxVal = firstOrOnly(schema.max);
  if (value > maxVal)
    return errorMessage(schema, property, value, "max");
}

module.exports = function NumberSchema (schema, property, value) {
  var values = [].concat(value);
  var results = [];
  var error, val;

  for (var i = 0; i < values.length; i++) {
    val = values[i];
    if (schema.min && (error = min(schema, property, val)))
      return { error:  error };
    if (schema.max && (error = max(schema, property, val)))
      return { error:  error };
    results[i] = val;
  }
  return { value: _.isArray(value) ? results : results[0] };
};
