---
task_id: TASK-001
title: "Core slugify: lowercase, hyphen separators, input validation"
date: 2026-10-31
person: "melonlee"
state: review
risk: low
spec_refs: [SPEC-001]
commit: self
---

# TASK-001: Core slugify

## Goal

Deliver the smallest useful `slugify(text)`: lowercase, every run of non-alphanumeric characters becomes one hyphen, no leading/trailing hyphen, and a `TypeError` for non-strings. Non-goal for this task: accented letters (TASK-002) and length limits (TASK-003).

## Acceptance trace

| Acceptance | Scenario | Test | Result |
|---|---|---|---|
| AC-001 | SC-001 | `AC-001 turns words and punctuation into a lowercase hyphenated slug` | pass |
| AC-002 | SC-002 | `AC-002 collapses separator runs and trims leading/trailing hyphens` | pass |
| AC-003 | SC-003 | `AC-003 rejects non-string input with a TypeError` | pass |
| AC-004 | Edge case | `AC-004 returns an empty string when nothing slug-worthy remains` | pass |

## TDD evidence

Recorded by `hepha record-check` in `.hepha/evidence/TASK-001.json`.

| Phase | Command | Exit | Meaning |
|---|---|---:|---|
| RED | `node --test test/slugify.test.js` | 1 | 4/4 tests fail against a `not implemented` stub |
| GREEN | `node --test test/slugify.test.js` | 1 | First attempt ran before the implementation was saved; gate kept the task in `doing` |
| regression | `npm test --silent` | 1 | Same cause as above |
| GREEN | `node --test test/slugify.test.js` | 0 | 4/4 pass with the minimal implementation |
| regression | `npm test --silent` | 0 | Full example suite passes |

## What changed

- `src/slugify.js`: type guard, `toLowerCase()`, `/[^a-z0-9]+/g → "-"`, trim hyphens.
- `test/slugify.test.js`: one test per acceptance criterion, named by AC id.
- `package.json`: `npm test` runs the suite with the built-in runner.

## Reviews

- Spec review (claude-spec-reviewer): passed — each AC maps to exactly one test.
- Code review (claude-code-reviewer): passed — notes that accented letters are currently treated as separators (`Crème` → `cr-me`); that is TASK-002's scope.
- Human approval: recorded after this summary.
- Browser check: not applicable (library, no UI).

## Asset candidate

- Policy: `candidate`
- Candidate: `.hepha/wiki/candidates/CHK-001.md` — edge cases worth testing for any slug function.

## Risks and follow-ups

- Non-ASCII letters are dropped entirely until TASK-002 lands.
