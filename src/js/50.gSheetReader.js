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
    tabletop.modelNames.forEach(function (sheetName) {
      gSheetReaderInstance.TransformCurrentSheetData(
        tabletop,
        sheetName,
        viewModel
      );
    });
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
      tabletop.models[this.SHEET_DATATYPE]
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
  define(function () {
    return GoogleSheetReader;
  });
} else {
  window.GoogleSheetReader = GoogleSheetReader;
}
