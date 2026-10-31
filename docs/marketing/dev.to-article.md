---
title: "After your coding agent says “done”, what can you actually check?"
tags: ai, claude, codex, tdd
cover_image: https://raw.githubusercontent.com/melonlee/hepha-skill/main/docs/assets/brand/hepha-share-card-en.png
---

# After your coding agent says "done", what can you actually check?

Give Claude Code or Codex a small, well-scoped change and it usually nails it. Give it a sprawling feature and you come back to a large diff, a long transcript and a confident summary. Afterwards, you can only check two things:

- **the diff** (hard to review in one go), and
- **what the agent told you** ("all tests pass").

The second one is a claim. Nothing outside the conversation recorded it.

I built **Hepha** to change what's left behind after an agent run. The name comes from Hephaestus, the smith who made things by hammering them out piece by piece.

## What Hepha is

Hepha has two parts:

1. **A skill.** `skills/hepha/SKILL.md` plus a guard rule. The skill tells the agent to work one ready task at a time through this loop:

   ```
   SPEC → PLAN → RESEARCH → RED → GREEN → REGRESSION → REVIEW → SUMMARY → WIKI → COMMIT
   ```

2. **A zero-dependency Node CLI** that owns the facts in `.hepha/`:

   ```text
   hepha init | validate | record-check | record-review | transition
         publish-asset | build-index | sync-personal | version
   hepha-server   # read-only local review UI
   ```

This split is the core design decision. The agent writes the Spec, the plan, the code and the notes. The CLI runs the test commands, records exit codes and output, records reviews, and decides whether a state change is allowed.

## The gates

`transition` enforces a small state machine: `todo → doing → review → done`.

- **→ doing**: every dependency must be `done`. The CLI also stores a hash of the task contract: acceptance criteria, test plan, Spec refs, mode and asset policy.
- **→ review**: the task needs a RED run that *failed*, a passing GREEN run and a passing regression run. The CLI recorded all three itself. It also checks that the contract hash still matches.
- **→ done**: a passing Spec review and a passing code review are required, plus human approval (unless the manifest explicitly turns approval off). Full tasks also need a summary file, and the task's Wiki asset policy must be met.

If something is missing, the command exits non-zero and lists what's missing. Here is real output from the example in the repo, when `done` was attempted too early:

```text
$ hepha transition --root . --task TASK-001 --to done
Hepha: 状态门禁未通过：     # state gate failed
缺少人工批准                # missing human approval
缺少任务 summary            # missing task summary
缺少资产候选                # missing asset candidate
```

(The CLI messages are in Chinese; the skill is Chinese-first for records. Your Specs and summaries can be in any language.)

## Lite mode

Running the full loop on a one-line copy change is overkill. A task can declare `"mode": "lite"`. The validator accepts that only with `risk: "low"` and `asset_policy: "none"`. Lite keeps:

- Spec refs and acceptance criteria
- RED and GREEN
- code review and approval

It drops regression, the Spec review, the summary and the Wiki asset. Since `mode` is part of the fingerprinted contract, you can't switch a task to lite halfway through to get past a gate.

## Summary vs. Wiki

Hepha keeps three layers apart:

| Layer | Answers |
|---|---|
| Evidence (`evidence/TASK-*.json`) | What was run and reviewed, with which result? |
| Summary (`summary/<date>/<person>/TASK.md`) | What happened in this loop? |
| Wiki asset (`wiki/assets/*.md`) | What should I reuse next time, and where does it *not* apply? |

An asset must name its source Spec, task, test and commit. `publish-asset` refuses assets that look like they contain secrets. `sync-personal` copies published, non-confidential assets into `~/.hepha/wiki` with a cross-project index. Over time this gives you a searchable record of decisions and patterns, each of which can be traced back to a test that once failed.

## A real run

The repo has `examples/slugify`. It is a tiny library built from an empty folder using only the CLI: three tasks, two full and one lite. Everything in its `.hepha/` folder was produced by that run, including two refusals:

- A GREEN run executed before the implementation was saved, so it failed. That failure stays in the append-only evidence file, and the gate refused `review` until a later GREEN passed.
- The early `done` attempt shown above.

The run also turned up a real bug in Hepha. The frontmatter writer escaped backslashes that the reader never unescaped, so a published title came out as `\\\\p{M}`. The bug is fixed and covered by a test. A repository test re-checks every gate on the example in CI, so the example can't silently rot.

## How it compares

- **[Superpowers](https://github.com/obra/superpowers)** is a broad library of composable skills: brainstorming, plans, worktrees, subagent-driven development, TDD, code review and more. It installs as a plugin in many harnesses. Its enforcement lives in the skills' instructions.
- **[Spec Kit](https://github.com/github/spec-kit)** is a toolkit and CLI (`specify`) that scaffolds Spec-Driven Development: constitution → specify → plan → tasks → implement. It supports many agents and offers extensions, presets and workflows.
- **Hepha** is narrower. It is one compact loop for one person's delivery. The CLI records test runs and reviews, and it gates state changes on them. On top of that sits a personal Wiki with provenance and a local review page.

These tools overlap with Hepha in spirit. Hepha's niche is machine-checked evidence plus a knowledge trail.

## Try it

```bash
git clone https://github.com/melonlee/hepha-skill.git
# Claude Code (personal skill)
ln -s "$PWD/hepha-skill/skills/hepha" ~/.claude/skills/hepha
# Codex
ln -s "$PWD/hepha-skill/skills/hepha" ~/.agents/skills/hepha
```

Then, in your agent: `/hepha` (Claude Code) or `$hepha` (Codex), followed by your requirement.

Repo, examples and docs: **https://github.com/melonlee/hepha-skill** (MIT). Issues and critical feedback are very welcome. I especially want to hear where the gates get in your way.
