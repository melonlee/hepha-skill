# Task Backlog

**Requirement**: [Brief description of the overall requirement]
**Created**: [ISO timestamp]
**Last Updated**: [ISO timestamp]

## Tasks

```yaml
# Task Schema:
# - id: TASK-XXX (unique identifier)
# - title: clear action statement
# - state: todo | doing | blocked | done
# - depends_on: [list of task IDs]
# - acceptance: [list of testable pass conditions]
# - risk: low | medium | high
# - files_hint: [expected files/modules]

tasks:
  - id: TASK-001
    title: "[First actionable task]"
    state: todo
    depends_on: []
    acceptance:
      - "[Testable condition 1]"
      - "[Testable condition 2]"
    risk: low
    files_hint:
      - "[expected/file/path]"

  - id: TASK-002
    title: "[Second task, depends on TASK-001]"
    state: todo
    depends_on: [TASK-001]
    acceptance:
      - "[Testable condition]"
    risk: medium
    files_hint:
      - "[expected/file/path]"
```

## Quick Reference

### Status Legend
| Icon | State | Description |
|------|-------|-------------|
| ⏳ | todo | Not started, ready to execute |
| 🔄 | doing | Currently in progress |
| 🚫 | blocked | Waiting for dependency or issue |
| ✅ | done | Completed and verified |

### Ready Queue
Tasks ready to execute (all dependencies done):
- TASK-XXX: [Task title]
- TASK-XXX: [Task title]

### Blocked Tasks
Tasks waiting for resolution:
- None

### Dependency Summary
- Total tasks: [N]
- Completed: [N]
- In progress: [N]
- Blocked: [N]
- Ready to start: [N]
