var SheetConfigReader = function (options) {
  if (options === undefined) throw new Error("options must contains sheetUrl");
  if (options.sourceData === undefined)
    throw new Error(
      "options must contains raw data of the configuration sheet"
    );

  /**
   * The source data
   */
  this.SourceData = options.sourceData;

  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;

  /**
   * Define the name of the Key column.
   * It must match in the Configuration sheet.
   */
  this.COLUMN_KEY = "Key";
  /**
   * Define the name of the Value column.
   * It must match in the Configuration sheet.
   */
  this.COLUMN_VALUE = "Value";
  /**
   * Define the name of the Type column.
   * It must match in the Configuration sheet.
   */
  this.COLUMN_TYPE = "Type";
};

SheetConfigReader.prototype = {
  /**
   * Parse the data into an object.
   * @returns {object}
   */
  GetConfig: function () {
    if (this.enableLog) console.log(this.SourceData);
    const configChecker = new SheetConfigChecker(
      this.COLUMN_KEY,
      this.COLUMN_VALUE,
      this.COLUMN_TYPE
    );
    const KeyCol = this.SourceData.columnNames[0];
    configChecker.CheckColumnFormat(KeyCol, this.COLUMN_KEY);
    const ValueCol = this.SourceData.columnNames[1];
    configChecker.CheckColumnFormat(ValueCol, this.COLUMN_VALUE);
    const TypeCol = this.SourceData.columnNames[2];
    configChecker.CheckColumnFormat(TypeCol, this.COLUMN_TYPE);
    if (!configChecker.SomeVariablesExist(this.SourceData.elements)) return {};

    let config = {};
    let rowNumber = 2;
    this.SourceData.elements.forEach((variableRaw) => {
      this.ParseVariable(config, variableRaw, rowNumber, configChecker);
      rowNumber += 1;
    });
    if (this.enableLog) console.log("Config", config);
    configChecker.CheckIntegrity(config);
    return config;
  },
  /**
   * Parse the variable into the config object.
   * @param {object} config The config object filled from the parsed data.
   * @param {object} settingRow A tabletop row element.
   * @param {int} currentRowNum The number of the row being read. It is start at 2 as the row 1 is the headers
   * @param {object} configChecker The instance performing checks on the config.
   */
  ParseVariable: function (config, settingRow, currentRowNum, configChecker) {
    let keyStr = settingRow[this.COLUMN_KEY];
    const keyIsOk = configChecker.CheckSettingPart(
      keyStr,
      currentRowNum,
      this.COLUMN_KEY
    );

    let valueStr = settingRow[this.COLUMN_VALUE];
    const valueIsOk = configChecker.CheckSettingPart(
      valueStr,
      currentRowNum,
      this.COLUMN_VALUE
    );

    let typeStr = settingRow[this.COLUMN_TYPE];
    const typeIsOk = configChecker.CheckSettingPart(
      typeStr,
      currentRowNum,
      this.COLUMN_TYPE
    );

    const valueFinal = this.ParseValueAsType(valueStr, typeStr);
    if (!keyIsOk || !valueIsOk || !typeIsOk || valueFinal === undefined) return;
    Object.defineProperty(config, keyStr, {
      value: valueFinal,
    });
  },
  /**
   * Parse the value into the requested type.
   * @param {string} value The value as string
   * @param {string} type The type as a string
   * @returns {mixed} The value parsed into the type.
   */
  ParseValueAsType: function (value, type) {
    const convertUtil = new ConvertionUtility();
    switch (type) {
      case "string":
        return convertUtil.CheckAndReturnString(value);
      case "array":
        return convertUtil.ParseValueAsArray(value);
      case "boolean":
        return convertUtil.ParseValueAsBoolean(value);
      case "int":
        return convertUtil.ParseValueAsInt(value);
      default:
        console.warn(`The type ${type} is not implemented.`);
        return undefined;
    }
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = SheetConfigReader;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return SheetConfigReader;
  });
} else {
  window.SheetConfigReader = SheetConfigReader;
}
