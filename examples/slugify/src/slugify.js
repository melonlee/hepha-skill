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
    // DEC-001: NFKD splits "è" into "e" + U+0300 and folds compatibility forms ("ﬁ" -> "fi").
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = { slugify };
