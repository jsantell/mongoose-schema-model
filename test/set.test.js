var Model = require("../");
var expect = require("chai").expect;

function setter (x) {
  return x + "!!!";
}

function contextGetter (x) {
  return this.value * x;
}

function modTest (x) {
  if (/^[A-Z]*$/.test(x))
    return "pre";
  else
    return "post";
}

var schema = {
  setA: { type: String, set: setter },
  setWithModifier: { type: String, set: modTest, lowercase: true },
  context: { type: Number, set: contextGetter },
  nosetter: { type: Number }
};

var model = Model(schema);

describe("Setter", function () {
  it("Transforms the value passed in", function () {
    var ret = model.set("setA", "hello");
    expect(ret.value).to.be.equal("hello!!!");
    expect(ret.error).to.be.equal(null);
  });

  it("Applies schematype transformations before setter", function () {
    var ret = model.set("setWithModifier", "HELLO")
    expect(ret.value).to.be.equal("post");
    expect(ret.error).to.be.equal(null);
  });

  it("Calls setter in correct context", function () {
    var ctx = { value: 100 };
    var ret = model.set("context", 5, ctx);
    expect(ret.value).to.be.equal(500);
    expect(ret.error).to.be.equal(null);
  });
  
  it("Returns passed in value (identity) if no setter specified", function () {
    var ret = model.set("nosetter", 1024);
    expect(ret.value).to.be.equal(1024);
    expect(ret.error).to.be.equal(null);
  });
  
  it("Returns passed in value (identity) if no definition specified", function () {
    var ret = model.set("i-dont-exist", 2048);
    expect(ret.value).to.be.equal(2048);
    expect(ret.error).to.be.equal(null);
  });
});
