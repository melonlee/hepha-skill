"use strict";

/**
 * Turn human text into a lowercase, hyphen-separated, URL-safe slug.
 *
 * @param {string} text
 * @param {{ maxLength?: number }} [options]
 * @returns {string}
 */
function slugify(text, options = {}) {
  if (typeof text !== "string") {
    throw new TypeError(`slugify expects a string, received ${text === null ? "null" : typeof text}`);
  }
  const { maxLength } = options;
  if (maxLength !== undefined && !(Number.isInteger(maxLength) && maxLength > 0)) {
    throw new RangeError("maxLength must be a positive integer");
  }
  const slug = text
    // DEC-001: NFKD splits "è" into "e" + U+0300 and folds compatibility forms ("ﬁ" -> "fi").
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (maxLength === undefined || slug.length <= maxLength) return slug;
  return slug.slice(0, maxLength).replace(/-+$/, "");
}

module.exports = { slugify };
