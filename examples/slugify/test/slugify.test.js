const assert = require("node:assert/strict");
const test = require("node:test");

const { slugify } = require("../src/slugify");

// TASK-001 / SC-001..SC-003
test("AC-001 turns words and punctuation into a lowercase hyphenated slug", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
});

test("AC-002 collapses separator runs and trims leading/trailing hyphens", () => {
  assert.equal(slugify("  --Hepha   Forge__v2--  "), "hepha-forge-v2");
});

test("AC-003 rejects non-string input with a TypeError", () => {
  for (const value of [null, 42, undefined]) {
    assert.throws(() => slugify(value), TypeError);
  }
});

test("AC-004 returns an empty string when nothing slug-worthy remains", () => {
  assert.equal(slugify("!!!"), "");
  assert.equal(slugify(""), "");
});

// TASK-002 / SC-004
test("AC-005 folds accented Latin letters to their ASCII base letter", () => {
  assert.equal(slugify("Crème Brûlée à la carte"), "creme-brulee-a-la-carte");
  // DEC-001: NFKD (not NFD) also folds compatibility forms.
  assert.equal(slugify("ﬁnal ＡＢＣ"), "final-abc");
});

test("AC-006 does not transliterate non-Latin scripts", () => {
  assert.equal(slugify("你好"), "");
});
