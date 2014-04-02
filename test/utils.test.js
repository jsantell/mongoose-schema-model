var utils = require("../lib/utils");
var expect = require("chai").expect;

describe("utils.messageFormatter", function () {
  it("formats message based off of hash", function () {
    var replacer = { ADJECTIVE: "cold", NOUN: "trees", VERB: "mourn" };
    var message = "Make all the {ADJECTIVE} {NOUN} {VERB}.";
    var result = utils.messageFormatter(replacer, message);
    expect(result).to.be.equal("Make all the cold trees mourn.");
  });
});
