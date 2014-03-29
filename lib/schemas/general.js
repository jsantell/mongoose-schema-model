var utils = require("../utils");
var firstOrOnly = utils.firstOrOnly;
var errorMessage = utils.errorMessage;
var _ = require("underscore");

function validate (definition, property, value, context) {
  var isValid = firstOrOnly(definition.validate);
  if (!isValid.call(context, value))
    return errorMessage(definition, property, value, "validate");
}

exports.validate = function GeneralSchema (definition, property, value, context) {
  var values = [].concat(value);
  var results = [];
  var error, val;

  for (var i = 0; i < values.length; i++) {
    val = values[i];

    if (val == undefined && definition.required)
      return errorMessage(definition, property, value, "required");
    if (definition.validate && (error = validate(definition, property, value, context)))
      return error;
  }

  return null;
};
