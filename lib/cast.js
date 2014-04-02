var utils = require("./utils");

function castToNumber (value) {
  if (!isNaN(parseFloat(value, 10)) && isFinite(value))
    return parseFloat(value, 10);
  throw new Error();
}

function castToString (value) {
  return value + "";
}

function castTo (type) {
  return function (value) {
    if (type === Number) return castToNumber(value);
    if (type === String) return castToString(value);
  };
}

module.exports = function cast (definition, property, value) {
  var response = { value: null, error: null };
  var type = utils.firstOrOnly(definition.type);

  // Don't do type checking if value is undefined or null
  if (value == undefined)
    return response;

  // If it's an Array-type, cast value to an array if not already
  if (utils.isArray(definition.type) && !utils.isArray(value)) {
    value = [value];
  }

  try {
    response.value = utils.valueMap(value, castTo(type));
  } catch (e) {
    var typeString;
    if (type === Number)
      typeString = "Number";
    else if (type === String)
      typeString = "String";
    response.error = utils.errorMessage(definition, property, value, "cast", { DATATYPE: typeString });
  }

  return response;
};
