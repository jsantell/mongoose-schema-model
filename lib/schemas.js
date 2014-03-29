var NumberSchema = exports.NumberSchema = require("./schemas/number");
var StringSchema = exports.StringSchema = require("./schemas/string");
var GeneralSchema = exports.GeneralSchema = require("./schemas/general");
var validateType = require("./validate-type");

function getSchemaFunctions (definition, property) {
  if (definition.type === Number || (definition.type.length && definition.type[0] === Number))
    return NumberSchema;
  if (definition.type === String || (definition.type.length && definition.type[0] === String))
    return StringSchema;
  throw new Error("No definition found for " + definition.type);
}

exports.get = function (definition, property, value, context) {
  var SchemaFunctions = getSchemaFunctions(definition, property);
  var definition = definition[property];
  var getter = definition.get;
  return definition.get.call(context, value);
};

exports.set = function (definition, property, value, context) {
  var SchemaFunctions = getSchemaFunctions(definition, property);
  var setter = definition.set;
  var error;

  var transformed = SchemaFunctions.transform(definition, property, value, context);

  error = validateType(definition, property, transformed);

  if (!error)
    error = GeneralSchema.validate(definition, property, transformed, context);

  // If general validation methods fail, call SchemaType-specific validations
  if (!error)
    error = SchemaFunctions.validate(definition, property, transformed, context);

  return { value: transformed, error: error || null };
};
