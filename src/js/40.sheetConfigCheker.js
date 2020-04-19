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
  define(function () {
    return SheetConfigChecker;
  });
} else {
  window.SheetConfigChecker = SheetConfigChecker;
}
