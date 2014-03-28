var utils = require("../lib/utils");
var expect = require("chai").expect;

describe("utils.iterateKeys", function () {
  it("iterates over each key, calling `fn` with property name", function () {
    var obj = { a: "hello", b: "world" };
    var result = {};
    utils.iterateKeys(obj, function (key) {
      result[key] = obj[key];
    });
    expect(result.a).to.be.equal("hello");
    expect(result.b).to.be.equal("world");
  });
});

describe("utils.messageFormatter", function () {
  it("formats message based off of hash", function () {
    var replacer = { ADJECTIVE: "cold", NOUN: "trees", VERB: "mourn" };
    var message = "Make all the {ADJECTIVE} {NOUN} {VERB}.";
    var result = utils.messageFormatter(replacer, message);
    expect(result).to.be.equal("Make all the cold trees mourn.");
  });
});
