var Model = require("../");
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

var model = Model(schema);

describe("NumberSchema.min", function () {
  describe("Passes", function () {
    it("Number passes when value >= min", function () {
      var res = model.set('singleMin', 100);
      expect(res.value).to.be.equal(100);
      expect(res.error).to.be.equal(null);
      res = model.set('singleMin', 10);
      expect(res.value).to.be.equal(10);
      expect(res.error).to.be.equal(null);
    });
  
    it("[Number] passes when all values >= min", function () {
      var res = model.set('multiMin', [100, 50, 10]);
      expect(res.value[0]).to.be.equal(100);
      expect(res.value[1]).to.be.equal(50);
      expect(res.value[2]).to.be.equal(10);
      expect(res.error).to.be.equal(null);
    });
    
    it("Number passes when value >= min using custom message", function () {
      var res = model.set('singleMinCustom', 100 );
      expect(res.value).to.be.equal(100);
      expect(res.error).to.be.equal(null);
    });
    
    it("[Number] passes when all values >= min using custom message", function () {
      var res = model.set('multiMinCustom', [100, 50, 10]);
      expect(res.value[0]).to.be.equal(100);
      expect(res.value[1]).to.be.equal(50);
      expect(res.value[2]).to.be.equal(10);
      expect(res.error).to.be.equal(null);
    });

  });

  describe("Fails", function () {
    it("Number fails with message when value < min", function () {
      var res = model.set('singleMin', 5 );
      expect(res.error).to.be.equal("Path `singleMin` (5) is less than minimum allowed value (10).");
    });
    
    it("[Number] fails when some values < min", function () {
      var res = model.set('multiMin', [100, 50, 4]);
      expect(res.error).to.be.equal("Path `multiMin` (4) is less than minimum allowed value (10).");
    });
    
    it("Number fails when value < min using custom message", function () {
      var res = model.set('singleMinCustom', 5);
      expect(res.error).to.be.equal("Woops! min 5 singleMinCustom");
    });
    
    it("[Number] fails when some values < min using custom message", function () {
      var res = model.set('multiMinCustom', [100, 50, 5]);
      expect(res.error).to.be.equal("Woops! min 5 multiMinCustom");
    });
  });
});

describe("NumberSchema.max", function () {
  describe("Passes", function () {
    it("Number passes when value <= max", function () {
      var res = model.set('singleMax', 5);
      expect(res.value).to.be.equal(5);
      expect(res.error).to.be.equal(null);
      res = model.set('singleMax', 10);
      expect(res.value).to.be.equal(10);
      expect(res.error).to.be.equal(null);
    });
  
    it("[Number] passes when all values <= max", function () {
      var res = model.set('multiMax', [1, 2, 3]);
      expect(res.value[0]).to.be.equal(1);
      expect(res.value[1]).to.be.equal(2);
      expect(res.value[2]).to.be.equal(3);
      expect(res.error).to.be.equal(null);
    });
    
    it("Number passes when value <= max using custom message", function () {
      var res = model.set('singleMaxCustom', 5);
      expect(res.value).to.be.equal(5);
      expect(res.error).to.be.equal(null);
    });
    
    it("[Number] passes when all values <= max using custom message", function () {
      var res = model.set('multiMaxCustom', [1, 2, 3]);
      expect(res.value[0]).to.be.equal(1);
      expect(res.value[1]).to.be.equal(2);
      expect(res.value[2]).to.be.equal(3);
      expect(res.error).to.be.equal(null);
    });
  });

  describe("Fails", function () {
    it("Number fails with message when value > max", function () {
      var res = model.set('singleMax', 15);
      expect(res.error).to.be.equal("Path `singleMax` (15) is more than maximum allowed value (10).");
    });
    
    it("[Number] fails when some values > max", function () {
      var res = model.set('multiMax', [15, 3, 4]);
      expect(res.error).to.be.equal("Path `multiMax` (15) is more than maximum allowed value (10).");
    });
    
    it("Number fails when value > max using custom message", function () {
      var res = model.set('singleMaxCustom', 15);
      expect(res.error).to.be.equal("Woops! max 15 singleMaxCustom");
    });
    
    it("[Number] fails when some values < min using custom message", function () {
      var res = model.set('multiMaxCustom', [100, 50, 5]);
      expect(res.error).to.be.equal("Woops! max 100 multiMaxCustom");
    });
  });
});
