var DataTransformer = function (options) {
  if (options === undefined) throw new Error("options must be present");
  if (options.config === undefined)
    throw new Error("options must contains a config object");
  if (options.config.GoogleSheetsCmsVersion === undefined)
    throw new Error(
      "options.config must contain at least the version (GoogleSheetsCmsVersion)"
    );
  if (options.config.DefaultLanguage === undefined)
    throw new Error(
      "options.config must contain the default language (DefaultLanguage)"
    );

  /**
   * The Configuration
   */
  this.Config = options.config;
  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
};

/**
 * Define the prototype of DataTransformer
 */
DataTransformer.prototype = {
  TransformSheetData: function (sheet, dataType) {
    if (dataType === "ignore") return false;
    if (dataType === "array") return this.TransformDataToArray(sheet);
    if (dataType === "object") return this.TransformDataToObject(sheet);
    if (dataType === "nestedObject")
      return this.TransformDataToNestedObject(sheet);

    console.warn("Type " + dataType + " is not implemented at the moment. ");
    console.warn("Sheet '" + sheet.name + "' will be ignored.");
  },

  TransformDataToNestedObject: function (sheetData) {
    const valueColName = new SheetValidator({
      checkI8n: true,
      sheet: sheetData,
      config: this.Config,
    }).GetValueColumnIdentity(sheetData);

    const dataTransformer = this;
    var arrObjs = [];

    sheetData.elements.forEach(function (row) {
      var sectionName = row.Section;

      if (!arrObjs[sectionName]) {
        Object.defineProperty(arrObjs, sectionName, {
          value: {},
        });
      }

      Object.defineProperty(arrObjs[sectionName], row.Key, {
        value: dataTransformer.GetValueI8n(row, valueColName),
      });
    });
    return arrObjs;
  },

  TransformDataToArray: function (sheetData) {
    const dataTransformer = this;
    var labels = [];

    sheetData.elements.forEach(function (row) {
      labels.push({
        key: row.Key,
        value: row.Value,
        href: row.Href,
        order: row.Order,
        isActive: dataTransformer.GetTruthyValueFromStr(row.IsActive),
        openNewTab: dataTransformer.GetTruthyValueFromStr(row.OpenNewTab),
      });
    });
    return labels;
  },

  TransformDataToObject: function (sheetData) {
    var newObject = {};

    sheetData.elements.forEach(function (row) {
      Object.defineProperty(newObject, row.Key, {
        value: row.Value,
      });
    });

    return newObject;
  },

  GetValueI8n: function (row, valueColName) {
    if (this.enableLog) console.log("Value column is:", valueColName);
    const value = row[valueColName];
    if (this.enableLog) console.log("Value read:", value);
    return value;
  },
  GetTruthyValueFromStr: function (booleanStr) {
    if (booleanStr === undefined) return false;
    if (booleanStr.toLowerCase() !== "true") return false;

    return true;
  },
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = DataTransformer;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return DataTransformer;
  });
} else {
  window.DataTransformer = DataTransformer;
}
