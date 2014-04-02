var schemas = require("./lib/schemas");
var schemaGet = schemas.get;
var schemaSet = schemas.set;

var Model = function (schema, options) {
  this._schema = schema || {};
  this._options = options || {};
};

Model.prototype = {
  get: function (key, value, context) {
    var definition = this._schema[key];
    return definition ? schemaGet(definition, key, value, context) : value;
  },

  set: function (key, value, context) {
    var definition = this._schema[key];
    return definition ? schemaSet(definition, key, value, context) : { value: value, error: null };
  }
};

module.exports = function validate (schema, options) {
  return new Model(schema, options);
};
