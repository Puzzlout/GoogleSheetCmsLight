/*! gsheetcmslight v1.0.4 | (c) 2020  | GPL-3.0-or-later License | git+https://github.com/Puzzlout/GoogleSheetCmsLight.git */
var ConvertionUtility = function () {
  /**
   * The Seperator used for ParseValueAsArray method.
   */
  this.SEPERATOR = ",";
};

ConvertionUtility.prototype = {
  /**
   * Return string after checking it is a string, otherwise undefined.
   * @param {string} value The string to check before returning it.
   * @returns {string}
   */
  CheckAndReturnString: function (value) {
    const isString = typeof value === "string";
    if (isString) return value;

    return undefined;
  },
  /**
   * Parse a string to an array of string using the seperator, otherwise undefined.
   * @param {string} value The string to parse
   * @returns {array}
   */
  ParseValueAsArray: function (value) {
    const valueContainsSeperator = value.indexOf(this.SEPERATOR) !== -1;
    if (!valueContainsSeperator) {
      console.warn(
        `Value ${value} doesn't contain the seperator ${this.SEPERATOR}`
      );
      return undefined;
    }
    const valueArray = value
      .split(this.SEPERATOR)
      .map((newValue) => newValue.trim());

    return valueArray;
  },
  /**
   * Parse a string to boolean, otherwise undefined.
   * @param {string} value The string to convert to a boolean.
   * @returns {bool}
   */
  ParseValueAsBoolean: function (value) {
    const isTruthy = value.trim().toLowerCase() === "true";
    const isFalsy = value.trim().toLowerCase() === "false";

    if (!isTruthy && !isFalsy) {
      console.warn(`Value "${value}" is not true or false`);
      return undefined;
    }

    return isTruthy ? true : false;
  },
  /**
   * Parse a string to an integer, otherwise undefined.
   * @param {string} value The value to parse
   * @returns {int}
   * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/parseInt#Une_fonction_plus_stricte
   */
  ParseValueAsInt: function (value) {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value)) return Number(value);
    return undefined;
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = ConvertionUtility;
} else if (typeof define === "function" && define.amd) {
  define((function () {
    return ConvertionUtility;
  }));
} else {
  window.ConvertionUtility = ConvertionUtility;
}

var QueryStringUtility = function (options) {
  this.enableLog = false;
  if (options !== undefined && options.enableLog !== undefined)
    this.enableLog = op.enableLog;
};
QueryStringUtility.prototype = {
  /**
   * Finds a value for the key inside the query string.
   * @param {string} key The key of the value to find
   * @returns {string} The value matching the key.
   */
  GetValue: function (key) {
    const queryStringArray = this.GetKeyValuePairs();
    const value = queryStringArray[key];
    if (value === undefined && this.enableLog)
      console.warn(`Key "${key}" is not found in the query string`);

    return value;
  },
  /**
   * Converts the query string array into a key/value pairs.
   * @returns {array} The key/value representation of the query string.
   */
  GetKeyValuePairs: function () {
    const queryStringArray = this.GetArray();
    let queryStringKeyValueArray = [];
    queryStringArray.forEach((parameter) => {
      var paramterArray = parameter.split("=");
      Object.defineProperty(queryStringKeyValueArray, paramterArray[0], {
        value: paramterArray[1],
      });
    });
    return queryStringKeyValueArray;
  },
  /**
   * Converts the query string into an array after splitting it using the seperator "&"
   * @returns {array} The raw values in the query string
   */
  GetArray: function () {
    const requestUrl = document.location.href;

    if (requestUrl.indexOf("?") === -1) return [];

    const queryString = requestUrl.substring(
      requestUrl.indexOf("?") + 1,
      requestUrl.length
    );
    if (this.enableLog) console.log("Query is", queryString);
    return queryString.split("&");
  },
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = QueryStringUtility;
} else if (typeof define === "function" && define.amd) {
  define((function () {
    return QueryStringUtility;
  }));
} else {
  window.QueryStringUtility = QueryStringUtility;
}

var BrowserLanguageParser = function (options) {
  /**
   * Flag to enable console logs
   */
  this.enableLog = false;
  if (options !== undefined) {
    this.enableLog = options.enableLog | false;
  }
};

BrowserLanguageParser.prototype = {
  /**
   * Returns the default language since navigator.languages isn't supported.
   * @returns {string} The default language
   */
  ReturnDefaultIfNavigatorLangsUnsupported: function () {
    if (this.enableLog) {
      console.log("navigator.languages not supported...");
    }
    return undefined;
  },
  /**
   * Returns the default language since navigator.languages is undefined or null.
   * @returns {string} The default language
   */
  ReturnDefaultIfNavigatorLangsUndefinedOrNull: function () {
    if (this.enableLog) {
      console.log("navigator.languages is undefined or null...");
    }
    return undefined;
  },
  /**
   * Returns the default language since navigator.languages is empty.
   * @returns {string} The default language
   */
  ReturnDefaultIfNavigatorLangsEmpty: function () {
    if (this.enableLog) {
      console.log("navigator.languages is empty...");
    }
    return undefined;
  },
  /**
   * Read first language from navigator.languages when available
   * to load the site in the prefered user language.
   * @returns {string} navigator.languages[0] | DEFAULT_LANG
   */
  GetBrowserFirstLang: function () {
    if (!navigator.languages) {
      return this.ReturnDefaultIfNavigatorLangsUnsupported();
    }

    if (navigator.languages === undefined || navigator.languages === null) {
      return this.ReturnDefaultIfNavigatorLangsUndefinedOrNull();
    }

    if (navigator.languages.length === 0) {
      return this.ReturnDefaultIfNavigatorLangsEmpty();
    }

    return navigator.languages[0];
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = BrowserLanguageParser;
} else if (typeof define === "function" && define.amd) {
  define((function () {
    return BrowserLanguageParser;
  }));
} else {
  window.BrowserLanguageParser = BrowserLanguageParser;
}

var SheetValidator = function (options) {
  this.CheckI8n = true;

  if (options === undefined) return;
  if (options.checkI8n !== undefined) this.CheckI8n = options.checkI8n;

  if (options.sheet === undefined) throw new Error("Sheet is absent");
  if (options.sheet === {}) throw new Error("Sheet is empty");
  if (Object.keys(options.sheet).length === 0)
    throw new Error("Sheet has not properties");
  if (options.sheet.columnNames === undefined)
    throw new Error("Sheet column names is not set");

  if (options.sheet.columnNames.length === 0)
    throw new Error("Sheet has no columns");
  /**
   * The sheet columns
   */
  this.ColumnNames = options.sheet.columnNames;
  /**
   * The Configuration
   */
  this.Config = options.config;
  /**
   * The default Value column name
   */
  this.DEFAULT_COLUMN_NAME = "Value";
};

SheetValidator.prototype = {
  /**
   * Retrieve the first browser language
   * @returns {string} The language
   */
  RetrieveBrowserLang: function () {
    const firstLang = new BrowserLanguageParser({
      enableLog: this.enableLog,
    }).GetBrowserFirstLang();
    return firstLang;
  },
  /**
   * Retrieve the language in the GET parameter "lang"
   * @returns {string} The language
   */
  RetrieveRequestLang: function () {
    const requestLang = new QueryStringUtility({
      enableLog: this.enableLog,
    }).GetValue("lang");
    return requestLang;
  },
  /**
   * Decides which language that the app will used to retrieve the resource label.
   * If the Google Sheet configuration has one set, it is used.
   * Otherwise, the browser language is used.
   * @returns {string} The language
   */
  GetUsedLanguage: function () {
    const browserLang = this.RetrieveBrowserLang();
    const requestLang = this.RetrieveRequestLang();
    const configDefaultLang = this.Config.DefaultLanguage;

    const noLanguageDefined =
      configDefaultLang === undefined &&
      browserLang === undefined &&
      requestLang === undefined;

    if (noLanguageDefined && this.enableLog) {
      console.warn("No language found in the Google Sheet or the Browser.");
    }

    //If request lang is read, return it
    if (requestLang !== undefined) {
      this.SetDocumentLang(requestLang);
      return requestLang;
    }
    //If browser lang is read, return it
    if (browserLang !== undefined) {
      this.SetDocumentLang(browserLang);
      return browserLang;
    }
    //If config lang is read, return it
    if (configDefaultLang !== undefined) {
      this.SetDocumentLang(configDefaultLang);
      return configLang;
    }
    //Otherwise, return undefined.
    return undefined;
  },
  /**
   * Set the attribut lang in the HTML tag.
   * @param {string} language The language value
   */
  SetDocumentLang: function (language) {
    const docLang = document.querySelector("html");
    docLang.lang = language;
  },
  /**
   * Builds the column name of the value's row to read from the browser language
   * @returns {string}
   */
  BuildExpectedI8nColumnName: function () {
    const lang = this.GetUsedLanguage();
    return `${this.DEFAULT_COLUMN_NAME}_${lang}`;
  },
  /**
   * Builds the default column name of the value's row
   * @returns {string}
   */
  GetDefaultColumnValueName: function () {
    return this.DEFAULT_COLUMN_NAME;
  },
  /**
   * Finds the localized colunm name.
   *
   * @returns {string}  The column name found or False
   */
  GetI8nColumnExistsForUserLanguage: function () {
    const I8nColumnName = this.BuildExpectedI8nColumnName();
    return this.GetColumnName(this.ColumnNames, I8nColumnName);
  },
  GetValueColumnIdentity: function (sheet) {
    if (!this.CheckI8n) return this.DEFAULT_COLUMN_NAME;

    const i8nResult = this.GetI8nColumnExistsForUserLanguage();
    if (i8nResult.isValid) return i8nResult.columnName;

    console.info("Falling back to default column...");
    const defaultResult = this.GetColumnName(
      this.ColumnNames,
      this.DEFAULT_COLUMN_NAME,
      true
    );
    if (defaultResult.isValid) return defaultResult.columnName;

    const errorMsg = new Error(
      `The sheet "${sheet.name}" must at least contain a Value column`
    );
    throw new Error(errorMsg);
  },
  /**
   * Search the column name matching the closest the input in a list.
   *
   * @param {array} avaibleColumns The columns available in a sheet
   * @param {string} columnName The column to match against the row keys (which
   *  represent the colunm name of the sheet)
   * @param {bool} matchExactly Use an exact match or loose filtering.
   * @returns {string}  The column matching the closest the input. Ex: if input
   * was 'Value_fr and 'Value_fr-FR' existed, then 'Value_fr-FR' is returned.
   * Otherwise, false is returned.
   */
  GetColumnName: function (avaibleColumns, columnName, matchExactly = false) {
    if (this.enableLog) console.log("Row keys", avaibleColumns);

    var rowKeysFiltered = matchExactly
      ? this.FilterKeysExactly(columnName, avaibleColumns)
      : this.FilterKeysLoosely(columnName, avaibleColumns);

    if (this.enableLog) console.log("rowKeysFiltered", rowKeysFiltered);
    let columnExists = rowKeysFiltered.length > 0;

    if (!columnExists) {
      if (this.enableLog)
        console.log(
          `The sheet doesn't contain any column matching the column '${columnName}'`
        );

      return { isValid: false };
    }
    return { isValid: true, columnName: rowKeysFiltered[0] };
  },
  /**
   * Filter exactly matching the filter value.
   *
   * @param {string} filter The filter
   * @param {array} array The array of values to filter
   * @returns {array} The new array
   */
  FilterKeysExactly: function (filter, array) {
    if (filter === undefined) {
      throw new Error("Parameter filter is required");
    }
    if (typeof filter !== "string") {
      throw new Error("Parameter filter must be string");
    }
    if (array === undefined) {
      throw new Error("Parameter array is required");
    }
    if (!Array.isArray(array)) {
      throw new Error("Parameter array must be array");
    }
    if (array.length === 0) {
      throw new Error("Parameter array must have values");
    }

    let arrayFiltered = [];
    const regex = new RegExp("^" + filter.toLowerCase() + "$", "g");
    array.reduce((accumulator, key) => {
      return key.toLowerCase().match(regex)
        ? arrayFiltered.push(key)
        : arrayFiltered;
    });
    return arrayFiltered;
  },
  /**
   * Filter loosely matching the filter value.
   *
   * @param {string} filter The filter
   * @param {array} array The array of values to filter
   * @returns {array} The new array
   */
  FilterKeysLoosely: function (filter, array) {
    let arrayFiltered = [];
    array.reduce((accumulator, key) => {
      return key.toLowerCase().indexOf(filter.toLowerCase()) != -1
        ? arrayFiltered.push(key)
        : arrayFiltered;
    });
    return arrayFiltered;
  },
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = SheetValidator;
} else if (typeof define === "function" && define.amd) {
  define((function () {
    return SheetValidator;
  }));
} else {
  window.SheetValidator = SheetValidator;
}

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
  TransformSheetData: function (sheetData, dataType) {
    if (dataType === "ignore") return false;

    const valueColName = new SheetValidator({
      checkI8n: true,
      sheet: sheetData,
      config: this.Config,
    }).GetValueColumnIdentity(sheetData);

    if (dataType === "array")
      return this.TransformDataToArray(sheetData, valueColName);
    if (dataType === "object")
      return this.TransformDataToObject(sheetData, valueColName);
    if (dataType === "nestedObject")
      return this.TransformDataToNestedObject(sheetData, valueColName);

    console.warn("Type " + dataType + " is not implemented at the moment. ");
    console.warn("Sheet '" + sheetData.name + "' will be ignored.");
  },

  TransformDataToNestedObject: function (sheetData, valueColName) {
    const dataTransformer = this;
    var arrObjs = [];

    sheetData.elements.forEach((function (row) {
      var sectionName = row.Section;

      if (!arrObjs[sectionName]) {
        Object.defineProperty(arrObjs, sectionName, {
          value: {},
        });
      }

      Object.defineProperty(arrObjs[sectionName], row.Key, {
        value: dataTransformer.GetValueI8n(row, valueColName),
      });
    }));
    return arrObjs;
  },

  TransformDataToArray: function (sheetData, valueColName) {
    const dataTransformer = this;
    var labels = [];

    sheetData.elements.forEach((function (row) {
      labels.push({
        key: row.Key,
        value: dataTransformer.GetValueI8n(row, valueColName),
        href: row.Href,
        order: row.Order,
        isActive: dataTransformer.GetTruthyValueFromStr(row.IsActive),
        openNewTab: dataTransformer.GetTruthyValueFromStr(row.OpenNewTab),
      });
    }));
    return labels;
  },

  TransformDataToObject: function (sheetData, valueColName) {
    var newObject = {};
    const dataTransformer = this;

    sheetData.elements.forEach((function (row) {
      Object.defineProperty(newObject, row.Key, {
        value: dataTransformer.GetValueI8n(row, valueColName),
      });
    }));

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
  define((function () {
    return DataTransformer;
  }));
} else {
  window.DataTransformer = DataTransformer;
}

var SheetConfigChecker = function (keyColName, valueColName, typeColName) {
  if (keyColName === "")
    throw new Error("Please provide the keyColName parameter");
  if (valueColName === "")
    throw new Error("Please provide the valueColName parameter");
  if (typeColName === "")
    throw new Error("Please provide the typeColName parameter");

  this.KeyColName = keyColName;
  this.ValueColName = valueColName;
  this.TypeColName = typeColName;
  /**
   * Defines the name of the setting DefaultLanguage
   */
  this.DefaultLanguageSetting = "DefaultLanguage";
  /**
   * Defines the name of the setting SupportedLanguages
   */
  this.SupportedLanguagesSetting = "SupportedLanguages";
  /**
   * Defines the name of the setting UseLanguageMenu
   */
  this.UseLanguageMenuSetting = "UseLanguageMenu";
};

SheetConfigChecker.prototype = {
  /**
   * Look up the length of the array.
   * @param {array} elements The tabletop elements representing the rows of the
   * Configuration sheet.
   * @returns {bool}
   */
  SomeVariablesExist: function (elements) {
    if (elements === undefined) return false;

    return elements.length > 0;
  },
  /**
   * Check the column name
   * @param {string} columnName The string value of the column to ckeck
   * @param {string} whichColumn indicate which column we want to check.
   */
  CheckColumnFormat: function (columnName, whichColumn) {
    const undefinedMessage = `The ${whichColumn} colum must be named. It is undefined.`;
    const emptyMessage = `The ${whichColumn} colum must be named. It is empty.`;
    const badNameMessage = `The colum isn't named ${whichColumn}. It equals to "${columnName}".`;
    if (columnName === undefined) throw new Error(undefinedMessage);
    if (columnName.trim() === "") throw new Error(emptyMessage);

    switch (whichColumn) {
      case this.KeyColName:
        if (columnName !== this.KeyColName) throw new Error(badNameMessage);
        break;
      case this.ValueColName:
        if (columnName !== this.ValueColName) throw new Error(badNameMessage);
        break;
      case this.TypeColName:
        if (columnName !== this.TypeColName) throw new Error(badNameMessage);
        break;
      default:
        throw new Error("whichColumn parameter isn't right...");
    }
  },
  /**
   * Checks the setting is not empty
   * @param {string} settingPartValue The setting part value (Key, Value or Type) depending on whichColumn
   * @param {int} rowNumber The row in the sheet
   * @param {string} whichColumn indicate which column we want to check.
   */
  CheckSettingPart: function (settingPartValue, rowNumber, whichColumn) {
    const emptyMessage = `The ${whichColumn} in row ${rowNumber} is empty.`;
    const settingIsEmpty = settingPartValue.trim() === "";
    if (settingIsEmpty) {
      console.warn(emptyMessage);
      return false;
    }

    return true;
  },
  /**
   *
   */
  CheckIntegrity: function (config) {
    this.CheckSupportedLanguagesSetting(config);
    this.CheckUseLanguageMenuSetting(config);
  },
  CheckUseLanguageMenuSetting: function (config) {
    if (config[this.UseLanguageMenuSetting]) {
      const settingExists =
        config[this.SupportedLanguagesSetting] !== undefined;
      if (!settingExists)
        throw new Error(
          "SupportedLanguages must be set if UseLanguageMenu is TRUE"
        );
    }
  },
  CheckSupportedLanguagesSetting: function (config) {
    if (config[this.SupportedLanguagesSetting]) {
      const configValue = config[this.UseLanguageMenuSetting];
      const settingExists = configValue !== undefined;
      if (!settingExists) {
        console.warn("UseLanguageMenu must be set to use SupportedLanguages");
        return;
      }

      if (!configValue)
        console.warn("UseLanguageMenu must be TRUE to use SupportedLanguages");
    }
  },
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = SheetConfigChecker;
} else if (typeof define === "function" && define.amd) {
  define((function () {
    return SheetConfigChecker;
  }));
} else {
  window.SheetConfigChecker = SheetConfigChecker;
}

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
  define((function () {
    return SheetConfigReader;
  }));
} else {
  window.SheetConfigReader = SheetConfigReader;
}

var GoogleSheetReader = function (options) {
  if (options === "undefined")
    throw new Error("options must contains sheetUrl");

  /**
   * The url of the Google Sheet to read
   */
  this.sheetUrl = options.sheetUrl;
  /**
   * Flag to enable console logs
   */
  this.enableLog = options.enableLog | false;
  /**
   * The Google Sheet configuration
   */
  this.config = {};
  /**
   * The sheet defining the other sheet types
   */
  this.SHEET_DATATYPE = "Sheet_DataType";
  /**
   * The sheet defining the other sheet types
   */
  this.SHEET_CONFIGURATION = "Configuration";
};

GoogleSheetReader.prototype = {
  /**
   * Check that the source Google Sheets document contains a sheet named after SHEET_DATATYPE constant.
   *
   * @param {tabletop} tabletop instance of Table
   */
  CheckSheetTypeExists: function (tabletop) {
    if (tabletop.models[this.SHEET_DATATYPE] === undefined) {
      const invalidGoogleSheetMsg =
        "Please create a sheet 'Sheet_DataType' to define how should be transformed each sheet data";
      alert(invalidGoogleSheetMsg);
      throw new Error(invalidGoogleSheetMsg);
    }
  },
  /**
   * Checks that the sheet is declared in the sheet declaring the DataType of the data
   * contained in the sheet requested.
   *
   * @param {string} sheetDataType The type of data contained in the sheet
   * @param {string} sheetName The sheet name
   */
  CheckSheetType: function (sheetDataType, sheetName) {
    if (sheetDataType[sheetName] === undefined) {
      const sheetNotDeclaredInSheetDataType =
        "Please add " +
        sheetName +
        " in sheet 'Sheet_DataType' to define how it should be transformed from the Google Sheet document";
      alert(sheetNotDeclaredInSheetDataType);
      throw new Error(sheetNotDeclaredInSheetDataType);
    }
  },
  /**
   * Loads the configuration sheet data.
   * @param {tabletop} tabletop The instance of TableTop
   */
  LoadConfig: function (tabletop) {
    this.config = new SheetConfigReader({
      sourceData: tabletop.models[this.SHEET_CONFIGURATION],
      enableLog: this.enableLog,
    }).GetConfig();
  },
  /**
   * Load the Google sheet data in a promise using gsheet2json
   */
  GetData: function () {
    self = this;
    return new Promise(function (resolve, reject) {
      var options = {
        key: self.sheetUrl,
        callback: onLoad,
        simpleSheet: true,
      };

      function onLoad(data, tabletop) {
        // 'data' is the array for a simple spreadsheet
        // 'tabletop' is the whole object with sheets and more.
        // could resolve(tabletop) too.

        // probably should do an error check here and then:
        // if (err) {reject(err); }

        resolve(tabletop);
        return;
      }

      Tabletop.init(options);
    });
  },

  /**
   * Transform the data read with gsheet2json into the
   * desired structure to use in the application.
   *
   * @param {object} tabletop instance of TableTop
   * @returns {object} The output data to return the application
   */
  TransformData: function (tabletop) {
    if (this.enableLog) console.log(tabletop);
    this.CheckSheetTypeExists(tabletop);
    //since forEach doesn't use arrow function,
    //"this" in the forEach is not Vue instance!
    //so create a copy of this (Vue instance) to use into the forEach.
    const gSheetReaderInstance = this;
    let viewModel = {};
    this.LoadConfig(tabletop);
    tabletop.modelNames.forEach((function (sheetName) {
      gSheetReaderInstance.TransformCurrentSheetData(
        tabletop,
        sheetName,
        viewModel
      );
    }));
    if (this.enableLog) console.log("Formatted data", viewModel);
    return viewModel;
  },
  /**
   *
   * @param {object} tabletop The object representing the Google Sheet contents
   * @param {string} sheetName The current sheet name being processed
   * @param {object} viewModel The output data to return the application
   */
  TransformCurrentSheetData: function (tabletop, sheetName, viewModel) {
    const dataTransformerInput = {
      config: this.config,
      enableLog: this.enableLog,
    };
    var sheetDataType = this.GetSheetDataType(tabletop, dataTransformerInput);
    this.CheckSheetType(sheetDataType, sheetName);

    var sheet = tabletop.models[sheetName];
    var transformedData = new DataTransformer(
      dataTransformerInput
    ).TransformSheetData(sheet, sheetDataType[sheetName]);

    this.UpdateViewModel(viewModel, sheetName, transformedData);
  },
  /**
   * Reads the sheet SheetDataType in the Google Sheet.
   * @param {object} tabletop The object representing the Google Sheet contents
   * @param {object} request The options for the DataTransformer
   * @returns {object} The sheet SheetDataType data
   */
  GetSheetDataType: function (tabletop, request) {
    var result = new DataTransformer(request).TransformDataToObject(
      tabletop.models[this.SHEET_DATATYPE],
      "Value"
    );
    return result;
  },
  /**
   * Update the view model with the data read from a sheet in the Google Sheet document.
   * @param {object} viewModel The output data to return the application
   * @param {string} sheetName The current sheet name being processed
   * @param {object} newData The current sheet data formatted
   */
  UpdateViewModel: function (viewModel, sheetName, newData) {
    if (newData) {
      Object.defineProperty(viewModel, sheetName, {
        value: newData,
      });
    }
  },
};

if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = GoogleSheetReader;
} else if (typeof define === "function" && define.amd) {
  define((function () {
    return GoogleSheetReader;
  }));
} else {
  window.GoogleSheetReader = GoogleSheetReader;
}
