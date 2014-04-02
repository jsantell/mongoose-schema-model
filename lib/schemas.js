var NumberSchema = exports.NumberSchema = require("./schemas/number");
var StringSchema = exports.StringSchema = require("./schemas/string");
var GeneralSchema = exports.GeneralSchema = require("./schemas/general");
var utils = require("./utils");
var castType = require("./cast");

function getSchemaFunctions (definition, property) {
  if (definition.type === Number || (definition.type.length && definition.type[0] === Number))
    return NumberSchema;
  if (definition.type === String || (definition.type.length && definition.type[0] === String))
    return StringSchema;
  throw new Error("No definition found for " + definition.type);
}

exports.get = function (definition, property, value, context) {
  var getter = definition.get;
  return getter ? getter.call(context, value) : value;
};

exports.set = function (definition, property, value, context) {
  value = utils.clone(value);
  var SchemaFunctions = getSchemaFunctions(definition, property);
  var setter = definition.set;
  var error;

  // First call SchemaType transforms, which will only transform if correct type
  var transformed = SchemaFunctions.transform(definition, property, value, context);

  // Call `set` setter
  transformed = setter ? setter.call(context, transformed) : transformed;

  var castAttempt = castType(definition, property, transformed);
  
  if (castAttempt.error)
    error = castAttempt.error;
  else
    transformed = castAttempt.value;

  if (!error)
    error = GeneralSchema.validate(definition, property, transformed, context);

  // If general validation methods fail, call SchemaType-specific validations
  if (!error)
    error = SchemaFunctions.validate(definition, property, transformed, context);

  return { value: transformed, error: error || null };
};
