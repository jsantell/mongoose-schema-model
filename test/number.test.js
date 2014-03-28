var validation = require("../");
var expect = require("chai").expect;

var schema = {
  singleMin: { type: Number, min: 10 },
  multiMin: { type: [Number], min: 10 },
  singleMinCustom: { type: Number, min: [10, "Woops! {TYPE} {VALUE} {PATH}"] },
  multiMinCustom: { type: [Number], min: [10, "Woops! {TYPE} {VALUE} {PATH}"] },
  singleMax: { type: Number, max: 10 },
  multiMax: { type: [Number], max: 10 },
  singleMaxCustom: { type: Number, max: [10, "Woops! {TYPE} {VALUE} {PATH}"] },
  multiMaxCustom: { type: [Number], max: [10, "Woops! {TYPE} {VALUE} {PATH}"] }
};

var validFn = validation(schema);

describe("NumberSchema.min", function () {
  describe("Passes", function () {
    it("Number passes when value >= min", function () {
      var res = validFn({ singleMin: 100 });
      expect(res.singleMin).to.be.equal(100);
      res = validFn({ singleMin: 10 });
      expect(res.singleMin).to.be.equal(10);
    });
  
    it("[Number] passes when all values >= min", function () {
      var res = validFn({ multiMin: [100, 50, 10] });
      expect(res.multiMin[0]).to.be.equal(100);
      expect(res.multiMin[1]).to.be.equal(50);
      expect(res.multiMin[2]).to.be.equal(10);
    });
    
    it("Number passes when value >= min using custom message", function () {
      var res = validFn({ singleMinCustom: 100 });
      expect(res.singleMinCustom).to.be.equal(100);
    });
    
    it("[Number] passes when all values >= min using custom message", function () {
      var res = validFn({ multiMinCustom: [100, 50, 10] });
      expect(res.multiMinCustom[0]).to.be.equal(100);
      expect(res.multiMinCustom[1]).to.be.equal(50);
      expect(res.multiMinCustom[2]).to.be.equal(10);
    });

  });

  describe("Fails", function () {
    it("Number fails with message when value < min", function () {
      var res = validFn({ singleMin: 5 });
      expect(res).to.be.equal("Path `singleMin` (5) is less than minimum allowed value (10).");
    });
    
    it("[Number] fails when some values < min", function () {
      var res = validFn({ multiMin: [100, 50, 4] });
      expect(res).to.be.equal("Path `multiMin` (4) is less than minimum allowed value (10).");
    });
    
    it("Number fails when value < min using custom message", function () {
      var res = validFn({ multiMinCustom: 5 });
      expect(res).to.be.equal("Woops! min 5 multiMinCustom");
    });
    
    it("[Number] fails when some values < min using custom message", function () {
      var res = validFn({ multiMinCustom: [100, 50, 5] });
      expect(res).to.be.equal("Woops! min 5 multiMinCustom");
    });
  });
});

describe("NumberSchema.max", function () {
  describe("Passes", function () {
    it("Number passes when value <= max", function () {
      var res = validFn({ singleMax: 5 });
      expect(res.singleMax).to.be.equal(5);
      res = validFn({ singleMax: 10 });
      expect(res.singleMax).to.be.equal(10);
    });
  
    it("[Number] passes when all values <= max", function () {
      var res = validFn({ multiMax: [1, 2, 3] });
      expect(res.multiMax[0]).to.be.equal(1);
      expect(res.multiMax[1]).to.be.equal(2);
      expect(res.multiMax[2]).to.be.equal(3);
    });
    
    it("Number passes when value <= max using custom message", function () {
      var res = validFn({ singleMaxCustom: 5 });
      expect(res.singleMaxCustom).to.be.equal(5);
    });
    
    it("[Number] passes when all values <= max using custom message", function () {
      var res = validFn({ multiMaxCustom: [1, 2, 3] });
      expect(res.multiMaxCustom[0]).to.be.equal(1);
      expect(res.multiMaxCustom[1]).to.be.equal(2);
      expect(res.multiMaxCustom[2]).to.be.equal(3);
    });
  });

  describe("Fails", function () {
    it("Number fails with message when value > max", function () {
      var res = validFn({ singleMax: 15 });
      expect(res).to.be.equal("Path `singleMax` (15) is more than maximum allowed value (10).");
    });
    
    it("[Number] fails when some values > max", function () {
      var res = validFn({ multiMax: [15, 3, 4] });
      expect(res).to.be.equal("Path `multiMax` (15) is more than maximum allowed value (10).");
    });
    
    it("Number fails when value > max using custom message", function () {
      var res = validFn({ multiMaxCustom: 15 });
      expect(res).to.be.equal("Woops! max 15 multiMaxCustom");
    });
    
    it("[Number] fails when some values < min using custom message", function () {
      var res = validFn({ multiMaxCustom: [100, 50, 5] });
      expect(res).to.be.equal("Woops! max 100 multiMaxCustom");
    });
  });
});
