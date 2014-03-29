var Model = require("../");
var expect = require("chai").expect;

var types = ["a","b","c"];
var schema = {
  singleMatch: { type: String, match: /^abc/ },
  multiMatch: { type: [String], match: /^abc/ },
  singleMatchCustom: { type: String, match: [/^abc/, "Woops! {TYPE} {VALUE} {PATH}"] },
  multiMatchCustom: { type: [String], match: [/^abc/, "Woops! {TYPE} {VALUE} {PATH}"] },
  singleEnum: { type: String, enum: types },
  multiEnum: { type: [String], enum: types },
  singleEnumCustom: { type: String, enum: { values: types, message: "Woops! {TYPE} {VALUE} {PATH}"}},
  multiEnumCustom: { type: [String], enum: { values: types, message: "Woops! {TYPE} {VALUE} {PATH}"} },
  singleLowercase: { type: String, lowercase: true },
  multiLowercase: { type: [String], lowercase: true },
  singleUppercase: { type: String, uppercase: true },
  multiUppercase: { type: [String], uppercase: true },
  singleTrim: { type: String, trim: true },
  multiTrim: { type: [String], trim: true }
};

var model = Model(schema);

describe("StringSchema.match", function () {
  describe("Passes", function () {
    it("String passes when match.test(value)", function () {
      var res = model.set('singleMatch', "abcdef");
      expect(res.value).to.be.equal("abcdef");
      expect(res.error).to.be.equal(null);
    });
  
    it("[String] passes when all values match", function () {
      var res = model.set('multiMatch', ["abc", "abcde", "abcdef"]);
      expect(res.value[0]).to.be.equal("abc");
      expect(res.value[1]).to.be.equal("abcde");
      expect(res.value[2]).to.be.equal("abcdef");
      expect(res.error).to.be.equal(null);
    });
    
    it("String passes when match.test(val) using custom message", function () {
      var res = model.set('singleMatchCustom', "abc");
      expect(res.value).to.be.equal("abc");
      expect(res.error).to.be.equal(null);
    });
    
    it("[String] passes when all values match using custom message", function () {
      var res = model.set('multiMatchCustom', ["abc", "abcde", "abcdef"]);
      expect(res.value[0]).to.be.equal("abc");
      expect(res.value[1]).to.be.equal("abcde");
      expect(res.value[2]).to.be.equal("abcdef");
      expect(res.error).to.be.equal(null);
    });

  });

  describe("Fails", function () {
    it("String fails with message when !match.test(value)", function () {
      var res = model.set("singleMatch", "def");
      expect(res.error).to.be.equal("Path `singleMatch` is invalid (def).");
    });
    
    it("[String] fails when some values don't match", function () {
      var res = model.set("multiMatch", ["abc", "def", "abcdef"]);
      expect(res.error).to.be.equal("Path `multiMatch` is invalid (def).");
    });
    
    it("String fails when !match.test(value) using custom message", function () {
      var res = model.set("singleMatchCustom", "def");
      expect(res.error).to.be.equal("Woops! match def singleMatchCustom");
    });
    
    it("[String] fails when some values don't match using custom message", function () {
      var res = model.set("multiMatchCustom", ["abc", "def", "abcdef"]);
      expect(res.error).to.be.equal("Woops! match def multiMatchCustom");
    });
  });
});

describe("StringSchema.enum", function () {
  describe("Passes", function () {
    it("String passes when value in enum", function () {
      var res = model.set("singleEnum", "a");
      expect(res.value).to.be.equal("a");
      expect(res.error).to.be.equal(null);
    });
  
    it("[String] passes when all values in enum", function () {
      var res = model.set("multiEnum", ["a", "a", "b"]);
      expect(res.value[0]).to.be.equal("a");
      expect(res.value[1]).to.be.equal("a");
      expect(res.value[2]).to.be.equal("b");
      expect(res.error).to.be.equal(null);
    });
    
    it("String passes when value in enum using custom message", function () {
      var res = model.set("singleEnumCustom", "a");
      expect(res.value).to.be.equal("a");
      expect(res.error).to.be.equal(null);
    });
    
    it("[String] passes when all values <= enum using custom message", function () {
      var res = model.set("multiEnumCustom", ["a", "a", "c"]);
      expect(res.value[0]).to.be.equal("a");
      expect(res.value[1]).to.be.equal("a");
      expect(res.value[2]).to.be.equal("c");
      expect(res.error).to.be.equal(null);
    });
  });

  describe("Fails", function () {
    it("String fails with message when value not in enum", function () {
      var res = model.set("singleEnum", "e");
      expect(res.error).to.be.equal("`e` is not a valid enum value for path `singleEnum`.");
    });
    
    it("[String] fails when some values not in enum", function () {
      var res = model.set("multiEnum", ["a", "d", "b"]);
      expect(res.error).to.be.equal("`d` is not a valid enum value for path `multiEnum`.");
    });
    
    it("String fails when value not in enum using custom message", function () {
      var res = model.set("singleEnumCustom", "d");
      expect(res.error).to.be.equal("Woops! enum d singleEnumCustom");
    });
    
    it("[String] fails when some values < match using custom message", function () {
      var res = model.set("multiEnumCustom", ["a", "d"]);
      expect(res.error).to.be.equal("Woops! enum d multiEnumCustom");
    });
  });
});

describe("StringSchema.lowercase", function () {
  it("casts String to lower case", function () {
    var res = model.set("singleLowercase", "AbCdEfG");
    expect(res.value).to.be.equal("abcdefg");
    expect(res.error).to.be.equal(null);
  });
  
  it("casts [String] to lower case", function () {
    var res = model.set("multiLowercase", ["AAA", "BBB", "CCC"]);
    expect(res.value[0]).to.be.equal("aaa");
    expect(res.value[1]).to.be.equal("bbb");
    expect(res.value[2]).to.be.equal("ccc");
    expect(res.error).to.be.equal(null);
  });
});

describe("StringSchema.uppercase", function () {
  it("casts String to upper case", function () {
    var res = model.set("singleUppercase", "AbCdEfG");
    expect(res.value).to.be.equal("ABCDEFG");
    expect(res.error).to.be.equal(null);
  });
  
  it("casts [String] to uppercase", function () {
    var res = model.set("multiUppercase", ["aaa", "bbb", "ccc"]);
    expect(res.value[0]).to.be.equal("AAA");
    expect(res.value[1]).to.be.equal("BBB");
    expect(res.value[2]).to.be.equal("CCC");
    expect(res.error).to.be.equal(null);
  });
});

describe("StringSchema.trim", function () {
  it("trims String", function () {
    var res = model.set("singleTrim", "   aaa ");
    expect(res.value).to.be.equal("aaa");
    expect(res.error).to.be.equal(null);
  });
  
  it("trims [String]", function () {
    var res = model.set("multiTrim", ["aaa ", " bbb", "ccc"]);
    expect(res.value[0]).to.be.equal("aaa");
    expect(res.value[1]).to.be.equal("bbb");
    expect(res.value[2]).to.be.equal("ccc");
    expect(res.error).to.be.equal(null);
  });
});
