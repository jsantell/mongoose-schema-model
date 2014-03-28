var NumberSchema = exports.NumberSchema = require("./schemas/number");
var StringSchema = exports.StringSchema = require("./schemas/string");
var GeneralSchema = exports.GeneralSchema = require("./schemas/general");

exports.executeSchema = function (schema, property, value) {
  var results = GeneralSchema(schema, property, value);

  if (results.error)
    return results;

  if (schema.type === Number || (schema.type.length && schema.type[0] === Number))
    return NumberSchema(schema, property, results.value);
  if (schema.type === String || (schema.type.length && schema.type[0] === String))
    return StringSchema(schema, property, results.value);

  throw new Error("No schema found for " + schema.type);
};
