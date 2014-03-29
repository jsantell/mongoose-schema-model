var Model = require("../");
var expect = require("chai").expect;

var schema = {
  testRequired: { type: Number, required: true },
  testValidate: { type: Number, validate: function (x) { return x; } },
  testValidateCustom: { type: Number, validate: [function (x) { return x; }, "Woops! {TYPE} {VALUE} {PATH}"]}
};

var model = Model(schema);

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
