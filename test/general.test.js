var Model = require("../");
var expect = require("chai").expect;

var lastSetter = null;

var schema = {
  testRequired: { type: Number, required: true },
  testValidate: { type: Number, validate: function (x) { return x; } },
  testValidateCustom: { type: Number, validate: [function (x) { return x; }, "Woops! {TYPE} {VALUE} {PATH}"]},

  testString: { type: String },
  testMultiString: { type: [String] },
  testNumber: { type: Number },
  testMultiNumber: { type: [Number] },
  testOrder: { type: String, lowercase: true, set: function (x) {
    lastSetter = x;
    return x + "ABC";
  }, validate: function (x) { return x.length < 10; }},
  testOrderNumber: { type: Number, min: 10, set: function (x) {
    lastSetter = x;
    if (x === "im not a number")
      return 5000;
    return x;
  }}
};

var model = Model(schema);

describe("Order", function () {
  it("calls transforms before setter", function () {
    var res = model.set("testOrder", "HeLLo");
    expect(res.value).to.be.equal("helloABC");
    expect(res.error).to.be.equal(null);
  });
  
  it("calls setter before casting", function () {
    var res = model.set("testOrderNumber", "im not a number");
    expect(res.value).to.be.equal(5000);
    expect(res.error).to.be.equal(null);
  });

  it("calls casting before schema validations", function () {
    var res = model.set("testOrderNumber", "15");
    expect(res.value).to.be.equal(15);
    expect(res.error).to.be.equal(null);
  });

  it("calls schema validations before explicit validations");
});

describe("Casting", function () {
  it("casts Number to String and [String]", function () {
    var res = model.set("testString", 1); 
    expect(res.value).to.be.equal("1");
    expect(res.error).to.be.equal(null);
    var res = model.set("testMultiString", 1); 
    expect(res.value[0]).to.be.equal("1");
    expect(res.error).to.be.equal(null);
  });
  
  it("casts String to Number and [Number]", function () {
    var res = model.set("testNumber", "123.0"); 
    expect(res.value).to.be.equal(123);
    expect(res.error).to.be.equal(null);
    var res = model.set("testMultiNumber", "123.5"); 
    expect(res.value[0]).to.be.equal(123.5);
    expect(res.error).to.be.equal(null);
  });

  it("fails if it can't cast", function () {
    var res = model.set("testNumber", "I am not a number");
    expect(res.value).to.be.equal("I am not a number");
    expect(res.error).to.be.equal("Cast to Number failed for value `I am not a number` at path `testNumber`.");
  });
});

describe("GeneralSchema.required", function () {
  it("Passes if any non-null/undefined value passed in", function () {
    var res = model.set("testRequired", 1);
    expect(res.value).to.be.equal(1);
    expect(res.error).to.be.equal(null);
    res = model.set("testRequired", 0);
    expect(res.value).to.be.equal(0);
    expect(res.error).to.be.equal(null);
  });
  
  it("Fails if undefined or null", function () {
    var res = model.set("testRequired", undefined);
    expect(res.error).to.be.equal("Path `testRequired` is required.");
  });
});

describe("GeneralSchema.validate", function () {
  it("Passes if validation function returns truthy", function () {
    var res = model.set("testValidate", 5);
    expect(res.value).to.be.equal(5);
    expect(res.error).to.be.equal(null);
  });
  it("Fails if validation function returns falsy", function () {
    var res = model.set("testValidate", 0);
    expect(res.error).to.be.equal("Validator failed for path `testValidate` with value `0`");
  });
  it("Passes if validation function returns truthy with custom message", function () {
    var res = model.set("testValidateCustom", 5);
    expect(res.value).to.be.equal(5);
    expect(res.error).to.be.equal(null);
  });
  it("Fails if validation function returns falsy with custom message", function () {
    var res = model.set("testValidateCustom", 0);
    expect(res.error).to.be.equal("Woops! validate 0 testValidateCustom");
  });
});
