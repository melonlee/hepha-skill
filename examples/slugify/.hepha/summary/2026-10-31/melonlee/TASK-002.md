---
task_id: TASK-002
title: "Fold accented Latin letters to ASCII"
date: 2026-10-31
person: "melonlee"
state: review
risk: medium
spec_refs: [SPEC-001]
commit: self
---

# TASK-002: Fold accented Latin letters to ASCII

## Goal

`Crème Brûlée à la carte` must become `creme-brulee-a-la-carte` instead of `cr-me-br-l-e-la-carte`. Non-goal: transliterating non-Latin scripts or locale rules such as `ß` → `ss`.

## Research

Four options compared in `decision-log.md` (DEC-001). Chosen: `normalize("NFKD")` + strip `\p{M}`. A probe showed NFD would miss ligatures and full-width letters, and that `ø`, `ß`, `ł` are not decomposable — accepted as a documented limitation.

## Acceptance trace

| Acceptance | Scenario | Test | Result |
|---|---|---|---|
| AC-005 | SC-004 | `AC-005 folds accented Latin letters to their ASCII base letter` | pass |
| AC-006 | Non-goal guard | `AC-006 does not transliterate non-Latin scripts` | pass |

## TDD evidence

| Phase | Command | Exit | Meaning |
|---|---|---:|---|
| RED | `node --test test/slugify.test.js` | 1 | AC-005 failed (`cr-me-br-l-e-…`); AC-006 already passed — it guards existing behaviour |
| GREEN | `node --test test/slugify.test.js` | 0 | 6/6 pass |
| regression | `npm test --silent` | 0 | 6/6 pass, TASK-001 behaviour unchanged |

## What changed

- `src/slugify.js`: two lines — `normalize("NFKD")` and `replace(/\p{M}+/gu, "")` before lowercasing.
- `test/slugify.test.js`: AC-005, AC-006.
- `.hepha/decision-log.md`: DEC-001.

## Reviews

- Spec review: passed. Code review: passed (see evidence notes). Human approval recorded after this summary.

## Asset

- Policy: `required` → published `PAT-001` "Strip diacritics with NFKD + \p{M}".

## Risks and follow-ups

- Scandinavian/German/Polish users get partially folded slugs (`søren` → `s-ren`). Revisit only with a concrete need.
