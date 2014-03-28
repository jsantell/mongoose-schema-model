var typeName = require("./utils").typeName;
var NumberSchema = exports.NumberSchema = require("./schemas/number");
var StringSchema = exports.StringSchema = require("./schemas/string");

exports.executeSchema = function (schema, property, value) {
  if (schema.type === Number || (schema.type.length && schema.type[0] === Number))
    return NumberSchema.apply(null, arguments);
  if (schema.type === String || (schema.type.length && schema.type[0] === String))
    return StringSchema.apply(null, arguments);
  throw new Error("No schema found for " + schema.type);
};
