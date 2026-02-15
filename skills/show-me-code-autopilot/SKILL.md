---
name: show-me-code-autopilot
description: Runs autonomous iterative delivery loops for coding tasks using plan -> execute -> check -> review -> commit. Use when the user asks for autopilot loop execution, unattended small-step implementation, continuous self-planning, automated commits, tech-option research via web/GitHub, and browser-based validation with MCP or Playwright.
context: fork
agent: Explore
---

# Show Me Code Autopilot

## Purpose

Run each requirement as multiple small, autonomous loops:

`plan -> execute -> check -> review -> commit`

Keep looping with minimal user intervention until the backlog is done or a stop condition is hit.

## Activation

Activate only when the user explicitly asks for:

- autopilot / autonomous loop / unattended iteration
- continuous plan-execute-check-review-commit flow
- small-step commits until a larger requirement is completed

If the user did not explicitly request autopilot, do not force this mode.

## Non-Negotiable Operating Rules

1. One loop = one smallest shippable sub-task.
2. No commit before both engineering checks and browser review pass.
3. Every loop must update progress artifacts under `.autopilot/`.
4. If blocked, re-plan automatically; ask user only when truly necessary.
5. Prefer minimal diff and avoid unrelated files.

## Required Working Artifacts

Create and maintain these files:

- `.autopilot/backlog.md` - task graph and states (`todo`, `doing`, `blocked`, `done`)
- `.autopilot/progress.md` - per-loop execution log and evidence
- `.autopilot/decision-log.md` - research and technical decisions

If these files do not exist, create them before the first loop.

## Loop Protocol

Execute the following phases in order for each loop.

### 1) PLAN

Goal: pick exactly one ready sub-task from the backlog.

Steps:

1. Normalize current requirement into:
   - Goal
   - Definition of done
   - Constraints
   - Out of scope
2. Build/refresh task graph:
   - Decompose Epic -> Tasks
   - For each task, define input/output, acceptance, dependencies, risk
3. Select one task from ready queue (all dependencies done).
4. Write loop plan into `.autopilot/progress.md`:
   - selected task
   - expected files
   - expected checks
   - expected browser validation path

### 2) RESEARCH (required for tech choices and uncertainty)

Goal: make informed decisions with live evidence.

When to run:

- introducing a new library/framework/tool
- architecture-level change
- uncertain implementation approach
- browser automation strategy decisions

Minimum research quality bar:

1. Compare at least 2 options.
2. Prefer official docs and source repositories.
3. Record why selected option is better for current constraints.

Record in `.autopilot/decision-log.md`:

- option A / B summary
- evidence links or source notes
- tradeoffs
- final decision and rationale

### 3) EXECUTE

Goal: implement the chosen sub-task with minimal blast radius.

Rules:

- Keep changes focused on required files only.
- Avoid speculative refactors.
- Keep functions small and reusable.
- Add concise comments only where logic is non-obvious.

### 4) CHECK

Goal: verify engineering quality.

Run all relevant project checks (examples):

- lint
- tests
- build/typecheck

If any check fails:

1. Capture failure details in `.autopilot/progress.md`.
2. Fix the root cause.
3. Re-run checks.
4. Repeat until pass or retry limit is reached.

### 5) REVIEW (browser and UX evidence required for UI/flow changes)

Goal: verify behavior from a user perspective, not only compile success.

For UI/interaction changes, use MCP browser tools and/or Playwright to validate:

- page load success
- key interaction path works
- expected text/element state is visible
- major regressions are absent

Attach review evidence to `.autopilot/progress.md`:

- interaction steps
- observed result
- screenshots/snapshots when relevant

### 6) COMMIT

Commit only when:

- checks passed
- review passed
- acceptance criteria for selected task are met

Commit policy:

- one loop, one commit
- conventional commit format
- message explains purpose/why, not only what

Update task status in `.autopilot/backlog.md` to `done` and append commit hash in progress log.

## Re-Planning Policy

Trigger re-plan when:

- dependency changed
- repeated failures suggest wrong approach
- discovered scope mismatch

Re-plan behavior:

1. Split the current task into smaller tasks.
2. Mark blocked tasks explicitly with reason.
3. Continue from next ready task.

## Stop Conditions

Stop loop and report clearly if any condition is met:

1. No ready task and unresolved blockers remain.
2. Same task fails checks/review 2 consecutive loops.
3. Required tooling is unavailable (critical checks cannot run).
4. User-defined risk boundary is exceeded.

When stopped, provide:

- current status
- blocker root cause
- proposed next actions

## Completion Conditions

Consider a large requirement complete only when:

1. All backlog tasks are `done`.
2. Requirement-level definition of done is satisfied.
3. Relevant checks pass on final state.
4. Required review evidence is present.

Then generate a final completion summary:

- completed task list
- key decisions
- risk notes
- follow-up suggestions

## Communication Style During Autopilot

- Keep user updates brief and frequent.
- Do not ask for confirmation every loop.
- Ask user only for true ambiguity, policy conflicts, or missing credentials.

## Suggested Starter Prompt For Users

Use this starter format to begin a run:

1. Enable show-me-code-autopilot mode.
2. Run loop: plan -> execute -> check -> review -> commit.
3. Perform web/GitHub research before technical choices.
4. For UI flows, perform browser-based validation.
5. Continue until backlog is complete or stop condition is met.
6. Requirement/backlog: <paste requirement here>.

## Additional References

- Planning details: `references/planning_task-decomposition.md`
- Quality gates: `references/validation_quality-gates.md`
