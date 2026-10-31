# Hepha 进度日志

**需求**：Ship a dependency-free slugify(text, options) utility for URL-safe slugs
**负责人**：melonlee

## 循环历史

### Loop 1 — TASK-001 (full) · done

Progress: [███░░░░░░░] 1/3

- RED: 4/4 tests failed against a stub (exit 1).
- GREEN: first attempt failed because it ran before the implementation was saved; `transition --to review` was refused ("缺少 GREEN 通过测试证据"). Re-ran after saving: 4/4 pass.
- Regression: `npm test --silent` exit 0.
- Reviews: spec passed, code passed (noted accent gap → TASK-002).
- A premature `transition --to done` was refused: missing approval, summary and asset candidate.
- Summary + candidate CHK-001 written, approval recorded, task done.

### Loop 2 — TASK-002 (full) · done

Progress: [██████░░░░] 2/3

- Research: DEC-001 compared NFKD, NFD, lookup table and npm packages; chose NFKD + `\p{M}`.
- RED: AC-005 failed (`cr-me-br-l-e-…`); AC-006 guard test already passed.
- GREEN 6/6, regression 6/6.
- Reviews passed; PAT-001 published (asset policy `required`).
- Finding while dogfooding: the published PAT-001 title showed `\\\\p{M}` — Hepha's frontmatter writer escaped backslashes that its reader never unescaped. Reported against the Hepha runtime.
