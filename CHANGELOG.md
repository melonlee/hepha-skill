# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [2.1.0] - Unreleased

### Added

- `lite` task mode for small, low-risk changes (RED/GREEN + code review; no regression, Spec review, summary or asset).
- npm packaging: `hepha` and `hepha-server` bins, `files` allow-list, `hepha version` command. Not yet published.
- `examples/slugify`: a sample project delivered end to end with the CLI, a walkthrough, and `tests/example.test.js`, which re-checks its gates in CI.
- Brand identity (logo, banner, social preview, posters, workflow infographic) with sources in `docs/assets/brand/src`.
- Real screenshots of the local review UI in `docs/assets/screenshots`.
- MIT `LICENSE` file (the README already declared MIT).
- GitHub Actions CI running `npm test` on Node 18, 20 and 22.
- This changelog (moved out of the README).

### Changed

- README (EN/ZH) rewritten: Claude Code + Codex install, lite mode, gates, CLI reference, comparison, FAQ; badges point to `melonlee/hepha-skill`.
- `SKILL.md` description is now bilingual.
- Promotion copy moved to `docs/marketing/` and updated to the v2 loop.

### Fixed

- Frontmatter values containing `\` or `"` no longer gain extra escapes on every write/read round trip (e.g. on `publish-asset`).

## [2.0.0] - 2026-09-09

### Added

- Executable Spec/TDD/dual-review gates and task contract fingerprints.
- Project Wiki candidates, publishing, cross-project personal sync, provenance and metrics.
- Local HTML timeline, task evidence, Wiki views, search and lineage pages.
- Codex user-level installation metadata and automated runtime tests.

## [1.0.0]

### Added

- Initial release with task decomposition, progress visualization, validation and local summaries.
