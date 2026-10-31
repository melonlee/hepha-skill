const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  createWorkspace,
  evaluateTransition,
  recordCheck,
  recordReview,
  transitionTask,
  validateBacklog,
} = require("../skills/hepha/scripts/hepha-core");

function liteTask(overrides = {}) {
  return {
    id: "TASK-001",
    title: "Rename a CLI flag",
    state: "todo",
    mode: "lite",
    depends_on: [],
    acceptance: [{ id: "AC-001", given: "the CLI", when: "called with --json", then: "prints JSON" }],
    risk: "low",
    files_hint: ["bin/cli.js"],
    spec_refs: ["SPEC-001"],
    behavior_change: true,
    test_plan: { commands: ["node --test"] },
    knowledge: { asset_policy: "none" },
    ...overrides,
  };
}

function workspaceWith(tasks, manifestPatch = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hepha-lite-"));
  createWorkspace({ root, requirement: "lite mode", person: "Tester" });
  const backlogFile = path.join(root, ".hepha", "backlog.json");
  const backlog = JSON.parse(fs.readFileSync(backlogFile, "utf8"));
  backlog.tasks = tasks;
  fs.writeFileSync(backlogFile, `${JSON.stringify(backlog, null, 2)}\n`);
  if (Object.keys(manifestPatch).length) {
    const manifestFile = path.join(root, ".hepha", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    fs.writeFileSync(manifestFile, `${JSON.stringify({ ...manifest, ...manifestPatch }, null, 2)}\n`);
  }
  return root;
}

test("validateBacklog accepts lite only for low-risk tasks without asset policy", () => {
  const ok = validateBacklog({ schema_version: "2.0", tasks: [liteTask()] });
  assert.equal(ok.ok, true, ok.errors.join("\n"));

  const risky = validateBacklog({ schema_version: "2.0", tasks: [liteTask({ risk: "high" })] });
  assert.equal(risky.ok, false);
  assert.match(risky.errors.join("\n"), /lite 模式仅允许/);

  const withAsset = validateBacklog({ schema_version: "2.0", tasks: [liteTask({ knowledge: { asset_policy: "candidate" } })] });
  assert.equal(withAsset.ok, false);
  assert.match(withAsset.errors.join("\n"), /lite 模式仅允许/);

  const unknown = validateBacklog({ schema_version: "2.0", tasks: [liteTask({ mode: "turbo" })] });
  assert.equal(unknown.ok, false);
  assert.match(unknown.errors.join("\n"), /mode 只能是 full 或 lite/);
});

test("lite task still requires RED, GREEN, code review and human approval", () => {
  const root = workspaceWith([liteTask({ state: "review" })]);
  const task = liteTask({ state: "review" });
  const gate = evaluateTransition({ root, task, to: "done" });
  assert.equal(gate.ok, false);
  const errors = gate.errors.join("\n");
  assert.match(errors, /RED/);
  assert.match(errors, /GREEN/);
  assert.match(errors, /Code review/);
  assert.match(errors, /人工批准/);
  assert.doesNotMatch(errors, /regression/);
  assert.doesNotMatch(errors, /Spec review/);
  assert.doesNotMatch(errors, /summary/);
});

test("lite task completes without regression, Spec review, summary or Wiki asset", () => {
  const root = workspaceWith([liteTask()]);
  transitionTask({ root, taskId: "TASK-001", to: "doing" });
  recordCheck({ root, taskId: "TASK-001", phase: "red", command: "node --test", exitCode: 1 });
  recordCheck({ root, taskId: "TASK-001", phase: "green", command: "node --test", exitCode: 0 });
  transitionTask({ root, taskId: "TASK-001", to: "review" });
  recordReview({ root, taskId: "TASK-001", type: "code", status: "passed", reviewer: "Code Reviewer" });
  recordReview({ root, taskId: "TASK-001", type: "human", status: "passed", reviewer: "Owner" });
  const result = transitionTask({ root, taskId: "TASK-001", to: "done" });
  assert.equal(result.task.state, "done");
  assert.match(fs.readFileSync(path.join(root, ".hepha", "backlog.md"), "utf8"), /模式：`lite`/);
});

test("lite task respects approval_required=false like full tasks", () => {
  const root = workspaceWith([liteTask()], { approval_required: false });
  transitionTask({ root, taskId: "TASK-001", to: "doing" });
  recordCheck({ root, taskId: "TASK-001", phase: "red", command: "node --test", exitCode: 1 });
  recordCheck({ root, taskId: "TASK-001", phase: "green", command: "node --test", exitCode: 0 });
  transitionTask({ root, taskId: "TASK-001", to: "review" });
  recordReview({ root, taskId: "TASK-001", type: "code", status: "passed", reviewer: "Code Reviewer" });
  assert.equal(transitionTask({ root, taskId: "TASK-001", to: "done" }).task.state, "done");
});

test("switching a running full task to lite is a contract change", () => {
  const fullTask = liteTask({ mode: undefined });
  delete fullTask.mode;
  const root = workspaceWith([fullTask]);
  transitionTask({ root, taskId: "TASK-001", to: "doing" });
  const backlogFile = path.join(root, ".hepha", "backlog.json");
  const backlog = JSON.parse(fs.readFileSync(backlogFile, "utf8"));
  backlog.tasks[0].mode = "lite";
  fs.writeFileSync(backlogFile, `${JSON.stringify(backlog, null, 2)}\n`);
  recordCheck({ root, taskId: "TASK-001", phase: "red", command: "node --test", exitCode: 1 });
  recordCheck({ root, taskId: "TASK-001", phase: "green", command: "node --test", exitCode: 0 });
  assert.throws(() => transitionTask({ root, taskId: "TASK-001", to: "review" }), /任务契约已变更/);
});
