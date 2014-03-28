function validateType (type, value) {
  var typeOfValue = typeof value;
  switch (type) {
    case Number:
      return typeOfValue === 'number';
    case String:
      return typeOfValue === 'string';
    case Array:
      if (!_.isArray(value))
        return false;
      var elType = type[0];
      for (var i = 0; i < value.length; i++)
        if (!isInstanceOf(elType, value[i]));
          return false;
      return true;
  };
  return false;
}
exports.validateType = validateType;
