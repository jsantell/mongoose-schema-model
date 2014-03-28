var utils = require("../utils");
var firstOrOnly = utils.firstOrOnly;
var errorMessage = utils.errorMessage;
var _ = require("underscore");

function validate (schema, property, value) {
  var isValid = firstOrOnly(schema.validate);
  if (!isValid(value))
    return errorMessage(schema, property, value, "validate");
}

module.exports = function GeneralSchema (schema, property, value, options) {
  var values = [].concat(value);
  var results = [];
  var error, val;

  for (var i = 0; i < values.length; i++) {
    val = values[i];

    if (val == undefined && schema.required)
      return { error: errorMessage(schema, property, value, "required") };
    if (schema.validate && (error = validate(schema, property, value)))
      return { error: error };

    results[i] = val;
  }
  return { value: _.isArray(value) ? results : results[0] };
};
