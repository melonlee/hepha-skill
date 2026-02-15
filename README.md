# show-me-code-autopilot

English | [中文](./README.zh-CN.md)

This project focuses on one thing: turning large requirements into small, safe, continuously shippable tasks through an autopilot loop.

## Technical Approach

- **Two-layer control model**
  - `Skill` handles strategy and execution orchestration.
  - `Rule` enforces hard constraints and stop conditions.
- **Small-batch delivery**
  - Each loop only handles one minimal sub-task.
  - No "big-bang" refactor in a single round.
- **Evidence-driven quality**
  - Every loop must include verification output.
  - Commit is allowed only after `check + review` pass.
- **Deterministic stop policy**
  - Stop after repeated failures or no executable task.
  - Return blockers and current state to user.

## End-to-End Delivery Flow

```mermaid
flowchart TD
    A[Input: Requirement or backlog] --> B[Plan: split into minimal executable task]
    B --> C[Execute: implement code/doc/test change]
    C --> D[Check: run lint/test/build or targeted checks]
    D --> E{Check pass?}
    E -- No --> F[Analyze failure and retry once]
    F --> D
    E -- Yes --> G[Review: self-review scope risk and consistency]
    G --> H{Review pass?}
    H -- No --> B
    H -- Yes --> I[Commit: conventional commit]
    I --> J{More tasks?}
    J -- Yes --> B
    J -- No --> K[Output: completed changes + summary]
```

## Implementation Principle Diagram

```mermaid
flowchart LR
    U[User requirement] --> S[Skill engine]
    S --> P[Task planner]
    P --> X[Single-task executor]
    X --> V[Validation pipeline]
    V --> R[Review gate]
    R --> C[Commit gate]
    C --> O[Delivery output]

    G[Rule guardrails] --> P
    G --> X
    G --> V
    G --> R
    G --> C

    V --> E[Evidence: logs/tests/screenshots]
    E --> O
```

## Practical Landing Process

1. Provide a clear backlog (priority + expected result).
2. Start autopilot and force one-task-per-loop execution.
3. Keep each loop independently verifiable.
4. Merge only loops with clear evidence and low regression risk.
5. Stop immediately when guardrails are hit and output a blocker report.

## Scope and Non-goals

- This is an execution protocol, not a full external workflow scheduler.
- It optimizes continuous delivery speed under controlled risk.
- It does not replace product decisions when requirements conflict.
# show-me-code-autopilot
