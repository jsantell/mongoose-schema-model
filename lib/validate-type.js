var _ = require("underscore");
var errorMessage = require("./utils").errorMessage;

function isValidType (type, value) {
  var typeOfValue = typeof value;
  var arrayType = _.isArray(type);
  var coreType = arrayType ? type[0] : type;
  var expectedType = coreType === Number ? "number" :
                     coreType === String ? "string" :
                     null;

  if (arrayType) {
    if (!_.isArray(value))
      return false;

    for (var i = 0; i < value.length; i++) {
      if (typeof value[i] !== expectedType)
        return false;
    }
  } else {
    if (typeof value !== expectedType)
      return false;
  }
  return true;
}

module.exports = function validateType (definition, property, value) {
  // Don't do type checking if value is undefined or null
  if (value == undefined)
    return null;
  if (!isValidType(definition.type, value))
    return errorMessage(definition, property, value, "invalid-type");
  return null;
};
