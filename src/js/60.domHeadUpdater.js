var DomHeadUpdater = function (options) {
  if (options === undefined) throw new Error("options must contains sheetUrl");

  /**
   * Flag to active the feature to update the head meta tags
   */
  this.enableFeature = false;
  if (options.enableFeature) this.enableFeature = options.enableFeature;
  /**
   * Flag to log logs and warning in the console.
   */
  this.enableLog = false;
  if (options.enableLog !== undefined) this.enableLog = options.enableLog;

  /**
   * Flag to say if the data is present.
   */
  this.dataPresent = false;
  if (options.data) this.dataPresent = true;

  /**
   * The data to use to fill the tags.
   */
  this.data = options.data;
  this.ATTR_TEXT = "text";
  this.ATTR_CONTENT = "content";
};

DomHeadUpdater.prototype = {
  /**
   * Update Twitter tags
   */
  UpdateTwitterTags: function () {
    if (!this.dataPresent) return;
    this.UpdateHeadMetaTag(
      'meta[name="twitter:card"]',
      this.ATTR_CONTENT,
      this.data.twitterCard,
      "twitter:card tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[name="twitter:site"]',
      this.ATTR_CONTENT,
      this.data.twitterSite,
      "twitter:site tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[name="twitter:creator"]',
      this.ATTR_CONTENT,
      this.data.twitterCreator,
      "twitter:creator tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[name="twitter:description"]',
      this.ATTR_CONTENT,
      this.data.twitterDescription,
      "twitter:description tag is missing in head element"
    );

    this.UpdateHeadMetaTag(
      'meta[name="twitter:image"]',
      this.ATTR_CONTENT,
      this.data.twitterImage,
      "twitter:image tag is missing in head element"
    );
  },
  /**
   * Update the Open Graph tags
   * To optimise the SEO using Open Graph protocol: https://ogp.me/
   *
   */
  UpdateOgTags: function () {
    if (!this.dataPresent) return;
    this.UpdateHeadMetaTag(
      'meta[property="og:title"]',
      this.ATTR_CONTENT,
      this.data.ogTitle,
      "og:title tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[property="og:description"]',
      this.ATTR_CONTENT,
      this.data.ogDescription,
      "og:description tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[property="og:url"]',
      this.ATTR_CONTENT,
      this.data.ogUrl,
      "og:url tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[property="og:type"]',
      this.ATTR_CONTENT,
      this.data.ogType,
      "og:type tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[property="og:image"]',
      this.ATTR_CONTENT,
      this.data.ogImage,
      "og:image tag is missing in head element"
    );
    this.UpdateHeadMetaTag(
      'meta[property="og:image:alt"]',
      this.ATTR_CONTENT,
      this.data.ogImageAlt,
      "og:image:alt tag is missing in head element"
    );
  },
  UpdateGeneralTags: function () {
    if (!this.dataPresent) return;

    this.UpdateHeadMetaTag(
      "head title",
      "text",
      this.data.title,
      "title tag is missing in head element"
    );

    this.UpdateHeadMetaTag(
      'meta[name="description"]',
      "content",
      this.data.description,
      "description tag is missing in head element"
    );
  },
  /**
   * Update the value of the meta tag
   * @param {string} cssSelector The CSS selector for the tag to retrieve.
   * @param {string} metaTagValueProp The property name containing the value in the meta tag
   * @param {string} newValue The new value to set.
   * @param {string} errorMsg The message to log in error.
   */
  UpdateHeadMetaTag: function (
    cssSelector,
    metaTagValueProp,
    newValue,
    errorMsg
  ) {
    const title = document.querySelector(cssSelector);
    if (!title) {
      console.error(errorMsg);
      return;
    }
    if (title[metaTagValueProp] === undefined)
      throw new Error(
        `"${metaTagValueProp}" is not present from meta tag selected by "${cssSelector}""`
      );

    if (newValue === undefined)
      console.error(
        `${cssSelector} won't be updated because no value is defined in the MetaData sheet.`
      );
    if (newValue) title[metaTagValueProp] = newValue;
  },
  /**
   * Run all methods to update tags in head element when some data is provided.
   */
  Run: function () {
    if (!this.enableFeature) return;
    if (!this.dataPresent) return;

    this.UpdateGeneralTags();
    this.UpdateTwitterTags();
    this.UpdateOgTags();
  },
};
if (typeof module !== "undefined" && module.exports) {
  //don't just use inNodeJS, we may be in Browserify
  module.exports = DomHeadUpdater;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return DomHeadUpdater;
  });
} else {
  window.DomHeadUpdater = DomHeadUpdater;
}
