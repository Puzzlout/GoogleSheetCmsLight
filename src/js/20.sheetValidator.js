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
   * Decides which language that the app will used to retrieve the resource label.
   * If the Google Sheet configuration has one set, it is used.
   * Otherwise, the browser language is used.
   * @returns {string} The language
   */
  GetUsedLanguage: function () {
    const browserLang = this.RetrieveBrowserLang();
    const configLang = this.Config.DefaultLanguage;

    const bothConfigAndBrowserLangUndefined =
      configLang === undefined && browserLang === undefined;

    if (bothConfigAndBrowserLangUndefined && this.enableLog) {
      console.warn("No language found in the Google Sheet or the Browser.");
    }

    //If browser lang is read, return it
    if (browserLang !== undefined) return browserLang;
    //If config lang is read, return it
    if (configLang !== undefined) return configLang;
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
    return new SheetValidator().GetColumnName(this.ColumnNames, I8nColumnName);
  },
  GetValueColumnIdentity: function (sheet) {
    if (this.CheckI8n) {
      const i8nResult = this.GetI8nColumnExistsForUserLanguage();
      if (i8nResult.isValid) return i8nResult.columnName;
    }

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
  define(function () {
    return SheetValidator;
  });
} else {
  window.SheetValidator = SheetValidator;
}
