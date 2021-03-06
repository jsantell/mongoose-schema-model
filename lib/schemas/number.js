var utils = require("../utils");
var firstOrOnly = utils.firstOrOnly;
var errorMessage = utils.errorMessage;

function min (definition, property, value) {
  var minVal = firstOrOnly(definition.min);
  if (value < minVal)
    return errorMessage(definition, property, value, "min");
}

function max (definition, property, value) {
  var maxVal = firstOrOnly(definition.max);
  if (value > maxVal)
    return errorMessage(definition, property, value, "max");
}

/**
 * NumberSchema does not have implicit transformations, so this just returns the
 * passed in value.
 *
 * @param {Object} definition
 * @param {String} property
 * @param {Mixed} value
 * @param {Mixed} context
 * @return {Mixed}
 */
exports.transform = function NumberSchemaTransform (definition, property, value, context) {
  return value;
};

/**
 * Validates a value against type-specific validation (min, max) as well as
 * `validate` method in definition.
 *
 * @param {Object} definition
 * @param {String} property
 * @param {Mixed} value
 * @param {Mixed} context
 * @return {Mixed}
 */
exports.validate = function NumberSchemaValidate (definition, property, value) {
  var values = [].concat(value);
  var error, val;

  for (var i = 0; i < values.length; i++) {
    val = values[i];
    if (definition.min && (error = min(definition, property, val)))
      return error;
    if (definition.max && (error = max(definition, property, val)))
      return error;
  }
  return null;
};
