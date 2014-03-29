var _ = require("underscore");
var defaults = require("./lib/defaults");
var schemas = require("./lib/schemas");
var schemaGet = schemas.get;
var schemaSet = schemas.set;

var Model = function (schema, options) {
  this._schema = schema || {};
  this._options = options || {};
}

Model.prototype = {
  get: function (key, value, context) {
    var definition = this._schema[key];
    return schemaGet(definition, key, value, context);
  },

  set: function (key, value, context) {
    var definition = this._schema[key];
    return schemaSet(definition, key, value, context);
  }
};

module.exports = function validate (schema, options) {
  options = _.extend({}, options || {}, defaults);
  return new Model(schema, options);
};
