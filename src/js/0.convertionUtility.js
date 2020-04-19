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
  define(function () {
    return ConvertionUtility;
  });
} else {
  window.ConvertionUtility = ConvertionUtility;
}
