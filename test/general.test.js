var validation = require("../");
var expect = require("chai").expect;

var schema = {
  testRequired: { type: Number, required: true },
  testValidate: { type: Number, validate: function (x) { return x; } },
  testValidateCustom: { type: Number, validate: [function (x) { return x; }, "Woops! {TYPE} {VALUE} {PATH}"]}
};

var validFn = validation(schema);

describe("GeneralSchema.required", function () {
  it("Passes if any non-null/undefined value passed in", function () {
    var res = validFn({ testRequired: 1 });
    expect(res.testRequired).to.be.equal(1);
    res = validFn({ testRequired: 0 });
    expect(res.testRequired).to.be.equal(0);
  });
  
  it("Fails if undefined or null", function () {
    var res = validFn({ testRequired: null });
    expect(res).to.be.equal("Path `testRequired` is required.");
    res = validFn({ testRequired: undefined });
    expect(res).to.be.equal("Path `testRequired` is required.");
  });
});

describe("GeneralSchema.validate", function () {
  it("Passes if validation function returns truthy", function () {
    var res = validFn({ testValidate: 5 });
    expect(res.testValidate).to.be.equal(5);
    res = validFn({ testValidate: true });
    expect(res.testValidate).to.be.equal(true);
  });
  it("Fails if validation function returns falsy", function () {
    var res = validFn({ testValidate: 0 });
    expect(res).to.be.equal("Validator failed for path `testValidate` with value `0`");
  });
  it("Passes if validation function returns truthy with custom message", function () {
    var res = validFn({ testValidateCustom: 5 });
    expect(res.testValidateCustom).to.be.equal(5);
    res = validFn({ testValidateCustom: true });
    expect(res.testValidateCustom).to.be.equal(true);
  });
  it("Fails if validation function returns falsy with custom message", function () {
    var res = validFn({ testValidateCustom: 0 });
    expect(res).to.be.equal("Woops! validate 0 testValidateCustom");
  });
});
