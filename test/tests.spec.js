const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const mochaDom = require("mocha-jsdom");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

function makeEmptyOptions() {
  return {};
}
function makeOptionsWithUndefinedConfig() {
  return { config: undefined };
}
function makeOptionsWithEmptyConfig() {
  return { config: {} };
}
function makeFakeOptions() {
  return {
    config: { fake: "value" },
  };
}
function makeTrueOptions() {
  return {
    config: { GoogleSheetsCmsVersion: "value" },
  };
}

const DataTransformer = require("../dist/js/sheetValidator");
const DataTransformerMin = require("../dist/js/sheetValidator.min");

function testDataTransformer(TheClass) {
  describe("constructor", () => {
    it("constructor ko because options absent", (done) => {
      let exceptionHappened = false;
      try {
        var instance = new TheClass(undefined);
      } catch (error) {
        should.exist(error);
        expect(error.message).to.equal("options must be present");
        exceptionHappened = true;
      }
      expect(exceptionHappened).to.be.true;
      done();
    });
    it("constructor ko because options empty", (done) => {
      let exceptionHappened = false;
      try {
        var instance = new TheClass(makeEmptyOptions());
      } catch (error) {
        should.exist(error);
        expect(error.message).to.equal("options must contains a config object");
        exceptionHappened = true;
      }
      expect(exceptionHappened).to.be.true;
      done();
    });
    it("constructor ko because options.config missing", (done) => {
      let exceptionHappened = false;
      try {
        var instance = new TheClass(makeOptionsWithUndefinedConfig());
      } catch (error) {
        should.exist(error);
        expect(error.message).to.equal("options must contains a config object");
        exceptionHappened = true;
      }
      expect(exceptionHappened).to.be.true;
      done();
    });
    it("constructor ko because config has not minimum property", (done) => {
      let exceptionHappened = false;
      try {
        var instance = new TheClass(makeFakeOptions());
      } catch (error) {
        should.exist(error);
        expect(error.message).to.equal(
          "options.config must contain at least the version (GoogleSheetsCmsVersion)"
        );
        exceptionHappened = true;
      }
      expect(exceptionHappened).to.be.true;
      done();
    });
    it("constructor ok", (done) => {
      let exceptionHappened = false;
      try {
        var instance = new TheClass(makeTrueOptions());
      } catch (error) {
        should.not.exist(error);
        exceptionHappened = true;
      }
      expect(exceptionHappened).to.be.false;
      done();
    });
  });
  describe("TheClass methods", () => {
    it("RetrieveBrowserLang", (done) => {
      // let fakeOptions = makeFakeOptions();
      // fakeOptions.enableLog = true;
      // var instance = new TheClass(fakeOptions);
      // instance.RetrieveBrowserLang();
      done();
    });
    it("BuildExpectedI8nColumnName", (done) => {
      let fakeOptions = makeTrueOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      const value = instance.BuildExpectedI8nColumnName();
      expect(value).to.equal("Value_en-US");
      done();
    });
    it("BuildExpectedI8nColumnName - ko", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      const value = instance.BuildExpectedI8nColumnName();
      try {
        expect(value).to.equal("ko");
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("GetDefaultColumnValueName", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      const value = instance.GetDefaultColumnValueName();
      expect(value).to.equal("Value");
      done();
    });
    it("GetDefaultColumnValueName - ko", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      const value = instance.GetDefaultColumnValueName();
      try {
        expect(value).to.equal("Ko");
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("FilterKeysExactly - input array undefined", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      try {
        const value = instance.FilterKeysExactly("filter");
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("FilterKeysExactly - input array empty", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      try {
        const value = instance.FilterKeysExactly("filter", ["value"]);
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("FilterKeysExactly - input array cannot be an object", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      try {
        const value = instance.FilterKeysExactly("filter", {});
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("FilterKeysExactly - input filter undefined", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      try {
        const value = instance.FilterKeysExactly();
      } catch (error) {
        should.exist(error);
      }
      done();
    });
    it("FilterKeysExactly - input filter is not sting", (done) => {
      let fakeOptions = makeFakeOptions();
      fakeOptions.enableLog = true;
      var instance = new TheClass(fakeOptions);
      try {
        const value = instance.FilterKeysExactly();
      } catch (error) {
        should.exist(error);
      }
      done();
    });
  });
}
describe("Non-minified DataTransformer", function () {
  testDataTransformer(DataTransformer);
});

describe("Minified DataTransformer", function () {
  testDataTransformer(DataTransformerMin);
});
