var _ = require("underscore");
var getDefaultError = require("./messages").getDefaultError;

/**
 * Takes a schema and current property and value, and type of validation
 * and formats it using custom error message if it exists, or falls back
 * to default message.
 *
 * @param {Object} schema
 * @param {String} property
 * @param {Mixed} value
 * @param {String} type
 * @return {String}
 */

function errorMessage (schema, property, value, type) {
  var message = type === "enum" ? schema.enum.message || getDefaultError(type) :
                schema[type][1] || getDefaultError(type);
  return messageFormatter({
    PATH: property,
    VALUE: value,
    TYPE: type,
    MIN: firstOrOnly(schema.min),
    MAX: firstOrOnly(schema.max)
  }, message);
}
exports.errorMessage = errorMessage;

/**
 * Returns either the first element of an array,
 * or if not an array, returns itself
 *
 * @param {Mixed} obj
 * @return {Mixed}
 */
function firstOrOnly (obj) {
  return _.isArray(obj) ? obj[0] : obj;
}
exports.firstOrOnly = firstOrOnly;

/**
 * Utility to iterate over an object's keys, executing
 * `fn` for each key, passing in the property name.
 *
 * @param {Object} object
 * @param {Function} fn
 */
function iterateKeys (object, fn) {
  return _.forEach(_.keys(object), fn);
}
exports.iterateKeys = iterateKeys;

/**
 * Converts a template string, "Custom error for {PATH}" using the `object` keys
 * as the replacement values. Very crude.
 *
 * @param {Object} replacer
 * @param {String} message
 * @return {String}
 */

function messageFormatter (replacer, message) {
  iterateKeys(replacer, function (key) {
    var regex = new RegExp("{" + key + "}", "g");
    message = message.replace(regex, replacer[key]);
  });
  return message;
}
exports.messageFormatter = messageFormatter;

/**
 * Apply a function to a value or an array of values.
 * Returns the result of the passed in function on each item
 * as an array or flat value, depending on the argument.
 *
 * apply((x) => x * x, 4) // 16
 * apply((x) => x * x, [1,2,3]) // [1,4,9]
 *
 * @param {Function} fn
 * @param {Mixed} value
 * @return {Mixed}
 */

function apply (fn, value) {
  var isArray = _.isArry(value);
  var arrayedValue = isArray ? value : [value];

  return _[isArray ? "identity" : "first"](_.map(value, fn));
}
exports.apply = apply;

/**
 * Returns a string representation of a Mongoose Schema type
 *
 * @param {Object} type
 * @return {String}
 */

function typeName (type) {
  switch (type) {
    case Number:
      return "number";
    case String:
      return "string";
    case Array:
      if (type[0] === Number)
        return "number array";
      if (type[0] === String)
        return "string array";
      return "array";
  };
}
exports.typeName = typeName;
