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
  define(function () {
    return QueryStringUtility;
  });
} else {
  window.QueryStringUtility = QueryStringUtility;
}
