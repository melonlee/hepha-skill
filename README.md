# Hepha

<p align="center">
  <img src="hepha.png" alt="Hepha" width="200" />
</p>

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文</a>
</p>

<p align="center">

[![Stars](https://img.shields.io/github/stars/melonlee/Hepha?style=social)](https://github.com/melonlee/Hepha/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Compatible](https://img.shields.io/badge/Claude%20Code-Ready-brightgreen)](https://docs.claude.com/claude-code)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw%20Skill-Enabled-purple)](https://clawhub.ai/melonlee/hepha-skill)

</p>

<p align="center">
  <strong>Turn large requirements into small, safe, continuously shippable tasks — through autonomous iterative delivery loops.</strong>
</p>

<p align="center">

[Features](#features) · [Quick Start](#quick-start) · [How It Works](#how-it-works) · [Workflow Demo](#workflow-demo) · [Documentation](#documentation) · [Changelog](#changelog)

</p>

---

## ⭐ Why Hepha?

If you've ever spent hours specifying a feature, watching an AI agent go off the rails, and then spending more time fixing the chaos than writing the code — Hepha is for you.

Hepha forces a **disciplined loop**: PLAN → EXECUTE → CHECK → REVIEW → COMMIT. Every task is validated before touching the codebase. Every commit is minimal and safe.

> **"Less talk, show me code."** — Hepha's philosophy

### What you get

- 🚀 **Autonomous delivery** — One prompt, continuous commits until done
- 🛡️ **Risk-controlled** — Each loop ships one minimal, validated task
- 📊 **Visible progress** — Real-time task graph and progress bar
- 🔍 **Evidence-driven** — Every commit requires checks + browser review
- 🔄 **Self-correcting** — Auto-replans when blocked, asks only when truly necessary

---

## Features

| Feature | What it does |
|---------|-------------|
| **Auto-Decomposition** | Breaks large requirements into validated task graphs with dependency tracking |
| **Schema Validation** | Forces complete task definitions with required fields (id, title, state, depends_on, acceptance, risk, files_hint) |
| **Research Decision Matrix** | Explicit rules: research only when truly needed (new lib, arch change, >2 options), skip for CRUD/bugfix/style |
| **Progress Visualization** | Live progress bars, status tables, and task dependency graphs in Markdown |
| **Two-layer Control** | `Skill` handles strategy; `Rule` enforces hard constraints and stop conditions |
| **Deterministic Stop Policy** | Stops on repeated failures or no executable tasks; reports blockers clearly |

---

## Quick Start

```bash
# 1. Clone or copy the skill into your Claude Code/OpenClaw skills directory
cp -r skills/hepha ~/.claude/skills/

# 2. Activate Hepha mode with a single prompt
Enable hepha mode.
Run loop: plan -> execute -> check -> review -> commit.
Continue until backlog is complete.
Requirement: <paste your requirement here>
```

That's it. Hepha will:
1. Analyze your requirement and auto-decompose it into a task graph
2. Execute one task at a time through the validated loop
3. Commit after each successful loop
4. Stop when all tasks are done or a stop condition is hit

---

## How It Works

```mermaid
flowchart LR
    U[User Requirement] --> S[Skill Engine]
    S --> P[Auto-Decomposition]
    P --> T[Task Graph + Schema Validation]
    T --> E[Execute One Task]
    E --> C[Check: lint/test/build]
    C --> R[Review: browser validation]
    R --> V{Pass?}
    V -- No --> E
    V -- Yes --> G[Commit]
    G --> M{More Tasks?}
    M -- Yes --> E
    M -- No --> D[Delivery Summary]

    V -- Blocked --> B[Auto-Replan]
    B --> P
```

### The Loop: PLAN → EXECUTE → CHECK → REVIEW → COMMIT

#### 1. PLAN
- **Auto-Decomposition**: If no backlog exists, automatically break down requirements into tasks using patterns (CRUD, Authentication, UI Components, API Integration)
- **Schema Validation**: Every task must have: `id`, `title`, `state`, `depends_on`, `acceptance`, `risk`, `files_hint`
- **Select Task**: Pick from ready queue (all dependencies done)

#### 2. RESEARCH
Research is **ONLY** required for:
- ✅ New library/framework/tool
- ✅ Architecture changes
- ✅ Implementation uncertainty (>2 options)
- ❌ NOT for: CRUD, bug fixes, style changes

#### 3. EXECUTE
- Keep changes focused on required files only
- Avoid speculative refactors
- Keep functions small and reusable

#### 4. CHECK
Run all relevant project checks:
```
lint → tests → build/typecheck
```
Fix and retry until pass.

#### 5. REVIEW (For UI/flow changes)
Use MCP browser tools or Playwright to validate:
- Page load success
- Key interaction path works
- Expected state is visible

#### 6. COMMIT
Commit only when:
- ✅ checks passed
- ✅ review passed
- ✅ acceptance criteria met

---

## Workflow Demo

### Before & After

| Without Hepha | With Hepha |
|--------------|-----------|
| One big prompt, unpredictable output | One prompt, structured autonomous loops |
| No visibility into progress | Real-time task graph + progress bar |
| Large, risky commits | Small, validated commits after each loop |
| Goes off rails easily | Auto-replans when blocked |
| No evidence of quality | Every commit has check + review evidence |

### Live Progress Example

```
Overall Progress: [████████░░] 80% (4/5 tasks complete)

Status Summary:
| Status        | Count | Tasks                            |
|---------------|-------|----------------------------------|
| ✅ Done        | 4     | TASK-001, 002, 004, 005          |
| 🔄 In Progress| 1     | TASK-003                         |
| ⏳ Todo        | 0     | -                                |
| 🚫 Blocked    | 0     | -                                |

Task Dependency Graph:
TASK-001 (✅) ──► TASK-002 (✅) ──► TASK-003 (🔄)
     │
     └──────────────► TASK-004 (✅)
```

### Usage Example

```bash
# Prompt:
Enable hepha mode.
Run autonomous loops until complete.
Requirement: Implement user authentication with JWT.
```

The skill will:
1. Auto-decompose into 4-6 tasks (e.g., TASK-001: DB schema, TASK-002: auth middleware, TASK-003: login API, TASK-004: frontend login form, TASK-005: JWT validation)
2. Execute each task through the validated loop
3. Commit after each successful loop
4. Stop when complete or blocked

---

## Project Structure

```
skills/hepha/
├── SKILL.md                           # Main skill definition (for Claude Code/OpenClaw)
├── references/                        # Documentation
│   ├── decomposition-patterns.md      # Task breakdown patterns
│   ├── planning_task-decomposition.md # Task schema reference
│   ├── progress-template.md           # Progress visualization guide
│   └── validation_quality-gates.md    # Quality gate definitions
└── templates/                         # Runtime file templates
    ├── backlog.md.template             # Task graph template
    ├── progress.md.template           # Progress log template
    └── decision-log.md.template        # Research log template
```

## Runtime Artifacts

Hepha creates and maintains these files in your project's `.hepha/` directory:

| File | Purpose |
|------|---------|
| `backlog.md` | Task graph with states, dependencies, and risk levels |
| `progress.md` | Per-loop execution log with evidence and progress visualization |
| `decision-log.md` | Research and technical decisions with trade-off analysis |

---

## Technical Approach

- **Two-layer control model**
  - `Skill` handles strategy and execution orchestration
  - `Rule` enforces hard constraints and stop conditions
- **Small-batch delivery**: Each loop handles one minimal sub-task — no "big-bang" refactors
- **Evidence-driven quality**: Every loop includes verification output; commit only after `check + review` pass
- **Deterministic stop policy**: Stop after repeated failures or no executable tasks; report blockers and current state

## Scope and Non-goals

- ✅ This is an **execution protocol** for autonomous coding
- ✅ Optimizes continuous delivery speed under controlled risk
- ❌ Does **NOT** replace product decisions when requirements conflict
- ❌ Is **NOT** a full external workflow scheduler

---

## Documentation

- [Skill Definition](./skills/hepha/SKILL.md)
- [Decomposition Patterns](./skills/hepha/references/decomposition-patterns.md)
- [Progress Visualization Guide](./skills/hepha/references/progress-template.md)
- [Quality Gates](./skills/hepha/references/validation_quality-gates.md)
- [ClawHub Listing](https://clawhub.ai/melonlee/hepha-skill)

---

## Changelog

### v1.0.0 (2026-03-28)
- Initial release
- Auto-decomposition with task graph generation
- PLAN → EXECUTE → CHECK → REVIEW → COMMIT loop
- Schema validation for all tasks
- Research decision matrix
- Progress visualization with Markdown bars and dependency graphs
- Runtime artifacts: backlog.md, progress.md, decision-log.md
- Dual language support (English + 中文)

---

## License

MIT

<p align="center">
  Hepha — Built for developers who believe in <strong>evidence over promises</strong>.
</p>
