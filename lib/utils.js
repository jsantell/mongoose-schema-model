var getDefaultError = require("./messages").getDefaultError;

function isArray (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}
exports.isArray = isArray;

function clone (obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
}
exports.clone = clone;

function isObject (obj) {
  return obj === Object(obj);
}
exports.isObject = isObject;

function extend (to, from) {
  for (var prop in from)
    to[prop] = from[prop];
  return to;
}
exports.extend = extend;

function map (obj, fn) {
  var collect = [];
  var i = 0;
  if (isArray(obj))
    for (i = 0; i < obj.length; i++)
      collect.push(fn(obj[i], i));
  else
    for (var prop in obj)
      collect.push(fn(prop, i)) && ++i;
  return collect;
}
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

function errorMessage (schema, property, value, type, additional) {
  var message;

  if (type === "enum")
    message = schema.enum.message || getDefaultError(type);

  if (!message)
    message = (schema[type] && schema[type][1]) || getDefaultError(type);

  var config = {
    PATH: property,
    VALUE: value,
    TYPE: type,
    MIN: firstOrOnly(schema.min),
    MAX: firstOrOnly(schema.max)
  };

  if (additional) {
    console.log("EXTEND", config, additional);
    extend(config, additional);
  }

  return messageFormatter(config, message);
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
  return isArray(obj) ? obj[0] : obj;
}
exports.firstOrOnly = firstOrOnly;

/**
 * Converts a template string, "Custom error for {PATH}" using the `object` keys
 * as the replacement values. Very crude.
 *
 * @param {Object} replacer
 * @param {String} message
 * @return {String}
 */

function messageFormatter (replacer, message) {
  map(replacer, function (key) {
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
 * valueMap(4, (x) => x * x) // 16
 * valueMap([1,2,3], (x) => x * x) //[1,4,9]
 *
 * @param {Mixed} value
 * @param {Function} fn
 * @return {Mixed}
 */

function valueMap (value, fn) {
  return isArray(value) ? map(value, fn) : fn(value);
}
exports.valueMap = valueMap;
