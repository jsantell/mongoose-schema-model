var validation = require("../");
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

var validFn = validation(schema);

describe("StringSchema.match", function () {
  describe("Passes", function () {
    it("String passes when match.test(value)", function () {
      var res = validFn({ singleMatch: "abcdef" });
      expect(res.singleMatch).to.be.equal("abcdef");
    });
  
    it("[String] passes when all values match", function () {
      var res = validFn({ multiMatch: ["abc", "abcde", "abcdef"] });
      expect(res.multiMatch[0]).to.be.equal("abc");
      expect(res.multiMatch[1]).to.be.equal("abcde");
      expect(res.multiMatch[2]).to.be.equal("abcdef");
    });
    
    it("String passes when match.test(val) using custom message", function () {
      var res = validFn({ singleMatchCustom: "abc" });
      expect(res.singleMatchCustom).to.be.equal("abc");
    });
    
    it("[String] passes when all values match using custom message", function () {
      var res = validFn({ multiMatchCustom: ["abc", "abcde", "abcdef"] });
      expect(res.multiMatchCustom[0]).to.be.equal("abc");
      expect(res.multiMatchCustom[1]).to.be.equal("abcde");
      expect(res.multiMatchCustom[2]).to.be.equal("abcdef");
    });

  });

  describe("Fails", function () {
    it("String fails with message when !match.test(value)", function () {
      var res = validFn({ singleMatch: "def" });
      expect(res).to.be.equal("Path `singleMatch` is invalid (def).");
    });
    
    it("[String] fails when some values don't match", function () {
      var res = validFn({ multiMatch: ["abc", "def", "abcdef"] });
      expect(res).to.be.equal("Path `multiMatch` is invalid (def).");
    });
    
    it("String fails when !match.test(value) using custom message", function () {
      var res = validFn({ singleMatchCustom: "def" });
      expect(res).to.be.equal("Woops! match def singleMatchCustom");
    });
    
    it("[String] fails when some values don't match using custom message", function () {
      var res = validFn({ multiMatchCustom: ["abc", "def", "abcdef"] });
      expect(res).to.be.equal("Woops! match def multiMatchCustom");
    });
  });
});

describe("StringSchema.enum", function () {
  describe("Passes", function () {
    it("String passes when value in enum", function () {
      var res = validFn({ singleEnum: "a" });
      expect(res.singleEnum).to.be.equal("a");
    });
  
    it("[String] passes when all values in enum", function () {
      var res = validFn({ multiEnum: ["a", "a", "b"] });
      expect(res.multiEnum[0]).to.be.equal("a");
      expect(res.multiEnum[1]).to.be.equal("a");
      expect(res.multiEnum[2]).to.be.equal("b");
    });
    
    it("String passes when value in enum using custom message", function () {
      var res = validFn({ singleEnumCustom: "a" });
      expect(res.singleEnumCustom).to.be.equal("a");
    });
    
    it("[String] passes when all values <= enum using custom message", function () {
      var res = validFn({ multiEnumCustom: ["a", "a", "c"] });
      expect(res.multiEnumCustom[0]).to.be.equal("a");
      expect(res.multiEnumCustom[1]).to.be.equal("a");
      expect(res.multiEnumCustom[2]).to.be.equal("c");
    });
  });

  describe("Fails", function () {
    it("String fails with message when value not in enum", function () {
      var res = validFn({ singleEnum: "e" });
      expect(res).to.be.equal("`e` is not a valid enum value for path `singleEnum`.");
    });
    
    it("[String] fails when some values not in enum", function () {
      var res = validFn({ multiEnum: ["a", "d", "b"] });
      expect(res).to.be.equal("`d` is not a valid enum value for path `multiEnum`.");
    });
    
    it("String fails when value not in enum using custom message", function () {
      var res = validFn({ singleEnumCustom: "d" });
      expect(res).to.be.equal("Woops! enum d singleEnumCustom");
    });
    
    it("[String] fails when some values < match using custom message", function () {
      var res = validFn({ multiEnumCustom: ["a", "d"] });
      expect(res).to.be.equal("Woops! enum d multiEnumCustom");
    });
  });
});

describe("StringSchema.lowercase", function () {
  it("casts String to lower case", function () {
    var res = validFn({ singleLowercase: "AbCdEfG" });
    expect(res.singleLowercase).to.be.equal("abcdefg");
  });
  
  it("casts [String] to lower case", function () {
    var res = validFn({ multiLowercase: ["AAA", "BBB", "CCC"] });
    expect(res.multiLowercase[0]).to.be.equal("aaa");
    expect(res.multiLowercase[1]).to.be.equal("bbb");
    expect(res.multiLowercase[2]).to.be.equal("ccc");
  });
});

describe("StringSchema.uppercase", function () {
  it("casts String to upper case", function () {
    var res = validFn({ singleUppercase: "AbCdEfG" });
    expect(res.singleUppercase).to.be.equal("ABCDEFG");
  });
  
  it("casts [String] to uppercase", function () {
    var res = validFn({ multiUppercase: ["aaa", "bbb", "ccc"] });
    expect(res.multiUppercase[0]).to.be.equal("AAA");
    expect(res.multiUppercase[1]).to.be.equal("BBB");
    expect(res.multiUppercase[2]).to.be.equal("CCC");
  });
});

describe("StringSchema.trim", function () {
  it("trims String", function () {
    var res = validFn({ singleTrim: "   aaa " });
    expect(res.singleTrim).to.be.equal("aaa");
  });
  
  it("trims [String]", function () {
    var res = validFn({ multiTrim: ["aaa ", " bbb", "ccc"] });
    expect(res.multiTrim[0]).to.be.equal("aaa");
    expect(res.multiTrim[1]).to.be.equal("bbb");
    expect(res.multiTrim[2]).to.be.equal("ccc");
  });
});
