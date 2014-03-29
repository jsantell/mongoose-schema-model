var Model = require("../");
var expect = require("chai").expect;

function getter (x) {
  return x * x;
}

function contextGetter (x) {
  return this;
}

var schema = {
  getA: { type: Number, get: getter },
  context: { type: Number, get: contextGetter },
  nogetter: { type: Number }
};

var model = Model(schema);

describe("Getter tests", function () {
  it("Transforms the value passed in", function () {
    var ret = model.get("getA", 5);
    expect(ret).to.be.equal(25);
  });

  it("Uses the correct context if passed in", function () {
    var ctx = {};
    var ret = model.get("context", 5, ctx);
    expect(ret).to.be.equal(ctx);
  });
  
  it("Returns passed in value (identity) if no getter specified", function () {
    var ret = model.get("nogetter", 1024);
    expect(ret).to.be.equal(1024);
  });
  
  it("Returns passed in value (identity) if no definition specified", function () {
    var ret = model.get("i-dont-exist", 2048);
    expect(ret).to.be.equal(2048);
  });
});
