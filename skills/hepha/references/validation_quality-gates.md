# Validation Quality Gates

## Gate A: Engineering Checks

Run all relevant checks for touched scope:

- lint
- unit/integration tests
- build and type checks

Pass criteria:

- no blocking errors
- new/changed behavior covered by tests when feasible

## Gate B: Review Checklist

Before commit, verify:

1. Change matches selected task acceptance.
2. No unrelated file edits.
3. Edge cases considered.
4. Naming and structure remain consistent.

## Gate C: Browser Validation (UI/interaction changes)

Use browser tooling (MCP browser and/or Playwright):

1. Open affected page/route.
2. Execute critical user path.
3. Verify expected visible result.
4. Capture screenshot/snapshot when needed.

Pass criteria:

- key interactions are successful
- no obvious UI regression in affected path

## Commit Gate

Commit is allowed only when:

- Gate A passed
- Gate B passed
- Gate C passed when applicable

Commit message format:

`type(scope): short purpose`

Optional body should explain motivation and impact.
