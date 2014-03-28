var utils = require("../utils");
var firstOrOnly = utils.firstOrOnly;
var errorMessage = utils.errorMessage;
var _ = require("underscore");

function aEnum (schema, property, value) {
  var enums = schema.enum.values || schema.enum;
  if (!~enums.indexOf(value))
    return errorMessage(schema, property, value, "enum");
}

function match (schema, property, value) {
  var matcher = firstOrOnly(schema.match);
  if (!matcher.test(value))
    return errorMessage(schema, property, value, "match");
}

module.exports = function StringSchema (schema, property, value) {
  var values = [].concat(value);
  var results = [];
  var error, val;

  for (var i = 0; i < values.length; i++) {
    val = values[i];
    if (schema.match && (error = match(schema, property, val)))
      return { error: error };
    if (schema.enum && (error = aEnum(schema, property, val)))
      return { error: error };

    // Transformations
    if (val) {
      if (schema.lowercase)
        val = val.toLowerCase();
      if (schema.uppercase)
        val = val.toUpperCase();
      if (schema.trim)
        val = val.replace(/^\s+|\s+$/g, "");
    }
    results[i] = val;
  }
  return { value: _.isArray(value) ? results : results[0] };
};
