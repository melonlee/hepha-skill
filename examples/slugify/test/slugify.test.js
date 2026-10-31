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
