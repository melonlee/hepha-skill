# Planning Task Decomposition

## Planning Objective

Convert a large requirement into a dependency-aware queue of smallest executable tasks.

## Task Schema

For each task, define:

- `id`: stable identifier
- `title`: clear action statement
- `state`: `todo | doing | blocked | done`
- `depends_on`: list of task IDs
- `acceptance`: testable pass conditions
- `risk`: `low | medium | high`
- `files_hint`: expected files/modules

## Decomposition Rules

1. Prefer vertical slices that can be tested and committed independently.
2. Avoid tasks that touch too many unrelated modules.
3. If acceptance is vague, split further.
4. If estimate exceeds one loop, split further.

## Ready Queue Policy

A task enters ready queue only if:

- state is `todo`
- all `depends_on` tasks are `done`

Priority suggestion:

1. high-risk enablers first
2. foundation tasks before feature polish
3. user-visible value early when safe

## Re-Planning Triggers

Re-plan immediately if:

- discovered technical constraint invalidates current path
- repeated failures indicate wrong abstraction
- hidden dependency appears

## Re-Planning Actions

1. Pause current task and mark `blocked` with reason.
2. Add new prerequisite tasks.
3. Recompute ready queue.
4. Continue loop with next ready task.
