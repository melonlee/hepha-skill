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

### YAML Format Example

```yaml
# .autopilot/backlog.md example
tasks:
  - id: TASK-001
    title: "Create user authentication API endpoint"
    state: todo
    depends_on: []
    acceptance:
      - "POST /api/auth/login returns JWT token on valid credentials"
      - "Returns 401 on invalid credentials"
    risk: medium
    files_hint:
      - "src/api/auth.ts"
      - "src/middleware/auth.ts"

  - id: TASK-002
    title: "Implement login form UI"
    state: todo
    depends_on: [TASK-001]
    acceptance:
      - "Login form renders with email and password fields"
      - "Form submits to /api/auth/login"
      - "Stores JWT token in localStorage on success"
    risk: low
    files_hint:
      - "src/components/LoginForm.tsx"
```

### Validation Checklist

Before executing any task, verify:

- [ ] All tasks have unique `id` values
- [ ] All `state` values are valid (todo|doing|blocked|done)
- [ ] All `depends_on` reference existing task IDs
- [ ] No circular dependencies exist (A depends on B, B depends on A)
- [ ] All `acceptance` criteria are testable
- [ ] All `risk` values are valid (low|medium|high)
- [ ] At least one task is in ready state (todo + all dependencies satisfied)

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
