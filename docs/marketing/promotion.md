# Hepha 推广文案（v2.1）

> 所有文案只描述仓库里真实存在、可验证的能力。需要配图时使用 `docs/assets/brand/` 下的素材：
> `hepha-share-card-en.png`（1200×630，英文社区）、`hepha-poster-zh.png`（1080×1440，小红书/朋友圈）、`hepha-social-preview.png`（GitHub 社交预览）。

循环：`SPEC → PLAN → RESEARCH → RED → GREEN → REGRESSION → REVIEW → SUMMARY → WIKI → COMMIT`

---

## 短文案（X / 微博 / 即刻）

**English**

> Your agent said "done". Can you check it?
> Hepha is an agent skill + zero-dependency CLI for Claude Code & Codex: one small task per loop, a real failing test before the fix, separate Spec and code review, and a gate that refuses `done` until the evidence is on disk.
> Real end-to-end example in the repo. MIT.
> github.com/melonlee/hepha-skill

**中文**

> AI 说“做完了”，你能验证吗？
> Hepha 是给 Claude Code / Codex 用的开源 Skill + 零依赖 CLI：每轮只做一个小任务，测试必须先红后绿，Spec 审查和代码审查分开做，证据不全就不让标记完成。
> 小改动可以走 lite 模式，经验沉淀到个人工程 Wiki。
> github.com/melonlee/hepha-skill

---

## 中等长度（Reddit / V2EX / 掘金）

**English — r/ClaudeAI, r/ChatGPTCoding**

Title: Hepha: a gate-enforced Spec → TDD → review loop for Claude Code and Codex (with a real worked example)

Long agent runs have one problem I kept running into. Once the agent says "done", the only things I can check are a big diff and a transcript. "Tests pass" is a sentence the agent wrote. Nothing actually recorded it.

Hepha has two parts:

- A **skill** (`SKILL.md` + a guard rule) that runs the agent through one task per loop: `SPEC → PLAN → RESEARCH → RED → GREEN → REGRESSION → REVIEW → SUMMARY → WIKI → COMMIT`.
- A **zero-dependency Node CLI**. It runs your test commands and records the exit codes and output. It also records the reviews and blocks state transitions until the evidence exists:
  - A task can't reach `review` without a failing RED run and a passing GREEN run.
  - It can't reach `done` without Spec review, code review, approval, a summary and its asset.
  - When a task enters `doing`, the CLI fingerprints its contract. Quietly editing the acceptance criteria later fails the gate.

A few more pieces:

- **Lite mode** for small, low-risk tasks. You keep RED/GREEN and code review, and skip the paperwork.
- **Personal Wiki.** Reviewed, reusable notes (decisions, patterns, troubleshooting) are linked back to Spec, task, test and commit, and synced across projects.
- **Read-only local review UI** (`hepha-server`) with a timeline, evidence, search and lineage.

`examples/slugify` in the repo is a small library built end to end with the CLI. It shows the gates refusing two premature transitions, and dogfooding it turned up a real bug in Hepha itself.

It's not a replacement for Superpowers or Spec Kit. It's narrower: one compact loop with machine-checked evidence.

Repo: https://github.com/melonlee/hepha-skill (MIT)

**中文 — 掘金 / V2EX**

标题：给 Claude Code / Codex 加一道“证据门禁”：Hepha 开源了 v2.1

用 Agent 做大需求，最后能检查的往往只有一大坨 diff 和聊天记录。“测试都过了”是 Agent 说的，没有地方真正记录下来。

Hepha 分两部分：

- **Skill**：编排每轮只做一个任务，按 `SPEC → PLAN → RESEARCH → RED → GREEN → REGRESSION → REVIEW → SUMMARY → WIKI → COMMIT` 推进。
- **零依赖 CLI**：由 CLI 执行测试命令，记录退出码和输出，并对状态转换做门禁：
  - 没有失败的 RED 和通过的 GREEN，任务进不了 `review`。
  - 缺 Spec 审查、代码审查、人工批准、Summary 或资产，任务进不了 `done`。
  - 任务进入执行时会固化契约指纹，中途偷改验收条件，门禁会失败。

另外：

- **lite 模式**：只给低风险、不沉淀资产的小改动用，保留 RED/GREEN 和代码审查。
- **个人工程 Wiki**：审核过的可复用结论关联 Spec、Task、Test、Commit，可以跨项目同步和检索。
- **本地只读 Review 页面**：时间线、证据、搜索和来源谱系。

仓库里的 `examples/slugify` 是用 CLI 从零跑完的真实示例。里面能看到门禁拒绝了两次过早的状态转换，跑示例的过程中还顺手发现并修了 Hepha 自身的一个 bug。

仓库：https://github.com/melonlee/hepha-skill（MIT）

---

## 长文

见 [dev.to-article.md](./dev.to-article.md)。

---

## 目录/平台提交信息

**一句话**：Spec 驱动、测试先行的 Agent 交付循环。每个任务都要有真实的 RED/GREEN 证据和双审查才能完成，并沉淀为个人工程 Wiki。

**One-liner**: A spec-driven, test-first delivery loop for coding agents. A task is done only when real RED/GREEN runs and separate reviews are on record, and the reusable lessons go into a personal Wiki.

**关键词**：agent-skill, claude-code, codex, tdd, spec-driven-development, code-review, knowledge-base, developer-tools

**差异点（可核实）**：
1. 门禁由 CLI 执行，不只是提示词约定：缺证据时 `transition` 会返回非零并列出缺失项。
2. 任务契约指纹：执行期间修改验收、测试或资产策略会被拒绝。
3. 证据、Summary、Wiki 资产分层，资产带 Spec/Task/Test/Commit 四类来源。
4. lite 模式让小改动不必走全流程。
5. 零运行时依赖，Node ≥ 18。

**适合人群**：已经在用 Claude Code / Codex 做真实项目，想让 Agent 的产出能被事后核查的开发者。
