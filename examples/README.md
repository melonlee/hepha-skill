# Examples

## `slugify/`: a real Hepha run

[`slugify/`](./slugify) is a small Node.js library (`slugify(text, options)`, built-in `node:test`, no dependencies). It was built from an empty folder using only the Hepha CLI in this repository. Nothing in `slugify/.hepha/` was written by hand to fake a result:

- The CLI wrote the RED/GREEN/regression records while it ran the real commands, and it stores their exit codes and output.
- The CLI wrote the review records, the contract fingerprints and the indexes.
- An agent wrote the Spec, backlog, summaries, decision log and Wiki assets, which is the agent's job in the protocol. The CLI then validated them.

Who ran it: an AI coding agent (Claude) ran the whole loop in one session on 2026-10-31. Each `human` approval says `melonlee (recorded by agent)` and has a note that the agent recorded it. In a real project, the owner records this step.

```text
slugify/
├── src/slugify.js            # the delivered code
├── test/slugify.test.js      # 8 tests, named by acceptance ID (AC-001 … AC-008)
└── .hepha/
    ├── manifest.json         # requirement, owner, approval_required: true
    ├── specs/SPEC-001.md     # goals, non-goals, 5 scenarios, Definition of Done
    ├── backlog.json          # 3 tasks: 2 full, 1 lite (machine fact source)
    ├── backlog.md            # rendered by the CLI
    ├── decision-log.md       # DEC-001: NFKD vs NFD vs lookup table vs dependency
    ├── progress.md           # loop-by-loop log, including refused gates
    ├── evidence/TASK-00*.json# commands, exit codes, output, reviews, contract hash
    ├── summary/2026-10-31/melonlee/TASK-00{1,2}.md
    └── wiki/
        ├── assets/PAT-001.md       # published pattern
        ├── candidates/CHK-001.md   # checklist still waiting for review
        └── index.json
personal-wiki/                # what ~/.hepha/wiki looks like after `sync-personal`
```

## The run, step by step

All commands run from `examples/slugify`. `hepha` is `node ../../skills/hepha/scripts/hepha-cli.js`.

### 0. Plan

```bash
hepha init --root . --requirement "Ship a dependency-free slugify(text, options) utility for URL-safe slugs" --person melonlee
# write .hepha/specs/SPEC-001.md and .hepha/backlog.json
hepha validate --root .
```

| Task | Mode | Risk | Asset policy | Depends on |
|---|---|---|---|---|
| TASK-001 Core slugify | full | low | candidate | – |
| TASK-002 Fold accented letters | full | medium | required | TASK-001 |
| TASK-003 `maxLength` option | **lite** | low | none | TASK-001 |

### 1. TASK-001 (full)

```bash
hepha transition    --root . --task TASK-001 --to doing        # fingerprints the task contract
hepha record-check  --root . --task TASK-001 --phase red   --command "node --test test/slugify.test.js"   # exit 1, 4/4 fail
hepha record-check  --root . --task TASK-001 --phase green --command "node --test test/slugify.test.js"   # exit 0
hepha record-check  --root . --task TASK-001 --phase regression --command "npm test --silent"           # exit 0
hepha transition    --root . --task TASK-001 --to review
hepha record-review --root . --task TASK-001 --type spec --status passed --reviewer claude-spec-reviewer --notes "..."
hepha record-review --root . --task TASK-001 --type code --status passed --reviewer claude-code-reviewer --notes "..."
# write summary + wiki candidate CHK-001
hepha record-review --root . --task TASK-001 --type human --status passed --reviewer "melonlee (recorded by agent)"
hepha transition    --root . --task TASK-001 --to done
```

The gates refused two steps in this run. Both refusals are in `progress.md`, and the first one is also in the evidence file:

1. The first GREEN run happened before the implementation was saved, so it exited with 1. `transition --to review` then failed with:

   ```text
   Hepha: 状态门禁未通过：          # state gate failed:
   缺少 GREEN 通过测试证据           # no passing GREEN evidence
   缺少 regression 通过证据          # no passing regression evidence
   ```

   That failed run is still in `evidence/TASK-001.json`, in order: `red:1 green:1 regression:1 green:0 regression:0`. Evidence is append-only, and the gate reads the latest run.

2. Running `transition --to done` before writing the summary failed with `缺少人工批准 / 缺少任务 summary / 缺少资产候选` (missing approval, summary and asset candidate).

### 2. TASK-002 (full, with research)

There was more than one credible approach, so the agent did a RESEARCH step and wrote it up as `DEC-001` in `decision-log.md`. A probe showed that NFD misses ligatures and full-width letters, and that `ø`, `ß` and `ł` cannot be decomposed. The agent recorded this as a known limitation and did not patch it.

RED failed only on AC-005. AC-006 is a guard for a non-goal and was expected to pass already. After GREEN, regression and both reviews, the task policy was `required`, so the candidate had to be published:

```bash
hepha publish-asset --root . --file .hepha/wiki/candidates/PAT-001.md --reviewer claude-code-reviewer
```

### 3. TASK-003 (lite)

`mode: "lite"` is accepted only together with `risk: "low"` and `asset_policy: "none"`. A lite task needs Spec refs, acceptance criteria, RED, GREEN, a code review and approval. It does not need regression, a Spec review, a summary or an asset. TASK-003 therefore has no summary file, and the gate still accepted `done`.

### 4. Indexes and personal Wiki

```bash
hepha build-index   --root .
hepha sync-personal --root . --wiki-root ../personal-wiki    # default target is ~/.hepha/wiki
```

`sync-personal` changed `source_commits: [self]` into the git hash of the latest commit that touched the asset file. You can see this in `personal-wiki/assets/*/PAT-001.md`.

## A bug the example found in Hepha

The published PAT-001 title showed up as `NFKD + \\\\p{M}`. Hepha's frontmatter writer escaped backslashes, but its reader never unescaped them, so every publish doubled them. The bug is fixed in `hepha-core.js` (commit `fix(core): round-trip escaped frontmatter values`), and a round-trip test was added. The PAT-001 title line was corrected once afterwards. Dogfooding exists to catch bugs like this.

## Check it yourself

```bash
# from the repository root
npm test          # includes tests/example.test.js, which re-checks every gate below
cd examples/slugify && npm test   # the example's own 8 tests

# browse the evidence
node ../../skills/hepha/scripts/hepha-server.js --root . --wiki-root ../personal-wiki --port 3000
```

`tests/example.test.js` checks the following:

- The backlog is valid and every task is `done`.
- Each task's contract fingerprint still matches its contract.
- Every task has a failing RED run.
- Every task would still pass its `done` gate.
- The published assets match the asset schema.
- The example's own tests pass.

If anyone edits the example so that it would no longer pass the gates, CI fails.

The screenshots in [`docs/assets/screenshots/`](../docs/assets/screenshots) were taken from this exact folder.
