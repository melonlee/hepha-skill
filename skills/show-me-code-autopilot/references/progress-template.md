# Progress Visualization Guide

## Purpose

This document explains the format rules and visualization elements for `.autopilot/progress.md`. For the actual template file, see `templates/progress.md.template`.

## File Structure

The progress.md file contains these sections:

1. **Header** - Requirement info and timestamps
2. **Progress Overview** - Visual progress bar and status summary
3. **Loop History** - Detailed log of each execution loop
4. **Risk Log** - Active risks and mitigations
5. **Completion Summary** - Final summary when all tasks done

---

## Progress Bar Format

```
Overall Progress: [████████░░] 80% (4/5 tasks complete)
                  ↑ completed   ↑ remaining
```

**Rules**:
- Use `█` for completed portion
- Use `░` for remaining portion
- Bar width: 10 characters total
- Show percentage and count: `(X/Y tasks complete)`

**Examples**:
```
[░░░░░░░░░░] 0% (0/5 tasks complete)
[███░░░░░░░░] 30% (1.5/5 tasks complete)
[██████████] 100% (5/5 tasks complete)
```

---

## Status Icons

| Icon | Meaning | State Value |
|------|---------|-------------|
| ✅ | Done | `done` |
| 🔄 | In Progress | `doing` |
| ⏳ | Todo | `todo` |
| 🚫 | Blocked | `blocked` |
| ⏭️ | Skipped | `skipped` |

---

## Status Summary Table

```markdown
Status Summary:
| Status | Count | Tasks |
|--------|-------|-------|
| ✅ Done | 4 | TASK-001, TASK-002, TASK-004, TASK-005 |
| 🔄 In Progress | 1 | TASK-003 |
| ⏳ Todo | 0 | - |
| 🚫 Blocked | 0 | - |
```

**Rules**:
- List actual task IDs for completed/in-progress tasks
- Use `-` for empty categories
- Update after each loop

---

## Dependency Graph Format

Use ASCII art for simple dependency visualization:

**Linear Chain**:
```
TASK-001 (✅) ──► TASK-002 (✅) ──► TASK-003 (🔄)
```

**Branching**:
```
TASK-001 (✅) ──► TASK-002 (✅)
     │
     ├──────────────► TASK-003 (✅)
     │
     └──────────────► TASK-004 (⏳)
```

**Converging**:
```
TASK-001 (✅) ──┐
TASK-002 (✅) ──┼──► TASK-003 (🔄)
TASK-003 (✅) ──┘
```

**Legend**:
```
  ──► : depends on
  (✅) : Done
  (🔄) : In Progress
  (⏳) : Todo
  (🚫) : Blocked
```

---

## Loop Entry Format

Each loop entry should contain:

```markdown
### Loop #[N] - TASK-[XXX]: [Task title]

**Time**: [ISO timestamp]
**State**: [✅ Completed | 🔄 In Progress | 🚫 Blocked]
**Commit**: [hash if completed]
**Retry Count**: [N if retrying]

**Plan**:
- Selected task: TASK-[XXX]
- Expected files: [list]
- Expected checks: [list]
- Expected browser validation: [description]

**Execution**:
- [What was done]

**Check Results**:
- [Check name]: [result]

**Review Results**:
- [What was validated]

**Files Changed**:
- [file path] (new/modified/deleted)

**Notes**:
- [Any important notes or discoveries]
```

---

## Auto-Update Rules

### After each loop:
1. Update progress bar percentage
2. Update status summary table
3. Refresh dependency graph with current states
4. Add new loop entry

### When task completes:
- Move task from 🔄 to ✅ in status summary
- Update dependency graph

### When task starts:
- Move task from ⏳ to 🔄 in status summary
- Update dependency graph

### When blocked:
- Add to 🚫 count in status summary
- Add entry to Risk Log

### On completion:
- Fill in Completion Summary section
- Generate final statistics

---

## Risk Log Format

```markdown
## Risk Log

| Date | Task | Risk | Mitigation | Status |
|------|------|------|------------|--------|
| 2025-02-15 | TASK-001 | JWT secret management | Use env variables | ✅ Resolved |
| 2025-02-15 | TASK-003 | Email service reliability | Add retry logic | 🔄 In Progress |
```

**Status Values**:
- `🔄 In Progress` - Being actively worked on
- `✅ Resolved` - No longer a risk
- `🚫 Blocked` - Unresolved blocker

---

## Related Files

- **Template**: `templates/progress.md.template` - Copy this to create new progress.md
- **Task Schema**: `references/planning_task-decomposition.md` - Task format reference
- **Backlog**: `.autopilot/backlog.md` - Source of task state for progress updates
