"use strict";

/**
 * Turn human text into a lowercase, hyphen-separated, URL-safe slug.
 *
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  if (typeof text !== "string") {
    throw new TypeError(`slugify expects a string, received ${text === null ? "null" : typeof text}`);
  }
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = { slugify };
