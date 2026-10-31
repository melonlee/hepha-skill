---
spec_id: SPEC-001
title: "slugify(text, options): URL-safe slugs without dependencies"
status: approved
---

# SPEC-001: slugify(text, options)

## Goals

- Turn arbitrary human text (titles, names, headings) into a lowercase, hyphen-separated, URL-safe slug.
- Fold accented Latin letters to their ASCII base letter so slugs stay readable (`Crème` → `creme`).
- Let callers cap the slug length without leaving a dangling hyphen.

## Non-goals

- Transliterating non-Latin scripts (Chinese, Cyrillic, Arabic ...). Characters that are not ASCII letters or digits after folding are treated as separators.
- Guaranteeing uniqueness (deduplicating `post`, `post-2` ...) — that belongs to the caller's storage layer.
- Locale-specific rules (e.g. German `ß` → `ss`).

## Constraints

- Zero runtime dependencies, CommonJS, Node.js >= 18.
- Pure function: no I/O, no global state.
- Tests use the built-in `node:test` runner.

## Behaviour scenarios

### SC-001: Basic slug

- Given: the text `Hello, World!`
- When: `slugify` is called
- Then: it returns `hello-world`

### SC-002: Separator runs and edges

- Given: the text `  --Hepha   Forge__v2--  `
- When: `slugify` is called
- Then: every run of non-alphanumeric characters becomes one hyphen and leading/trailing hyphens are removed: `hepha-forge-v2`

### SC-003: Invalid input

- Given: a value that is not a string (`null`, `42`, `undefined`)
- When: `slugify` is called
- Then: it throws a `TypeError` instead of returning `"null"` or `"42"`

### SC-004: Accented Latin letters

- Given: the text `Crème Brûlée à la carte`
- When: `slugify` is called
- Then: diacritics are removed and it returns `creme-brulee-a-la-carte`

### SC-005: Maximum length

- Given: the text `Small steps ship safely` and `{ maxLength: 12 }`
- When: `slugify` is called
- Then: the slug is at most 12 characters and does not end with a hyphen: `small-steps`

## Edge cases

- Text with no ASCII letters or digits (e.g. `!!!`, `你好`) returns an empty string.
- `maxLength` must be a positive integer; anything else throws a `RangeError`.

## Definition of Done

- All scenarios are covered by `node --test` cases that were seen failing (RED) before the implementation.
- `npm test` passes in `examples/slugify`.
- Each task has the review and approval evidence its mode requires in `.hepha/evidence/`.
