var utils = require("../utils");
var firstOrOnly = utils.firstOrOnly;
var valueMap = utils.valueMap;
var errorMessage = utils.errorMessage;
var _ = require("underscore");

function aEnum (definition, property, value) {
  var enums = definition.enum.values || definition.enum;
  if (!~enums.indexOf(value))
    return errorMessage(definition, property, value, "enum");
}

function match (definition, property, value) {
  var matcher = firstOrOnly(definition.match);
  if (!matcher.test(value))
    return errorMessage(definition, property, value, "match");
}

function transform (definition, value) {
  if (definition.lowercase)
    value = value.toLowerCase();
  if (definition.uppercase)
    value = value.toUpperCase();
  if (definition.trim)
    value = value.replace(/^\s+|\s+$/g, "");
  return value;
}

exports.transform = function StringSchemaTransform (definition, property, value, context) {
  value = _.clone(value);
  return valueMap(value, transform.bind(null, definition));
};

exports.validate = function StringSchemaValidate (definition, property, value, context) {
  var values = [].concat(value);
  var results = [];
  var error, val;

  for (var i = 0; i < values.length; i++) {
    val = values[i];
    if (definition.match && (error = match(definition, property, val)))
      return error;
    if (definition.enum && (error = aEnum(definition, property, val)))
      return error;
  }
  return null;
};
