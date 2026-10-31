// Keeps examples/slugify honest: its .hepha artifacts were produced by the CLI and must
// still satisfy the same gates the CLI enforces, and its own test suite must pass.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const {
  evaluateTransition,
  hephaPaths,
  loadEvidence,
  parseFrontmatter,
  readJson,
  taskContractHash,
  validateAsset,
  validateBacklog,
} = require("../skills/hepha/scripts/hepha-core");

const root = path.resolve(__dirname, "..", "examples", "slugify");
const paths = hephaPaths(root);

test("example backlog is valid and every task is done", () => {
  const backlog = readJson(paths.backlog);
  const result = validateBacklog(backlog, { root });
  assert.deepEqual(result.errors, []);
  assert.ok(backlog.tasks.length >= 3);
  for (const task of backlog.tasks) assert.equal(task.state, "done", task.id);
  assert.ok(backlog.tasks.some((task) => task.mode === "lite"), "example should include a lite task");
});

test("example tasks still pass their completion gates with recorded evidence", () => {
  const backlog = readJson(paths.backlog);
  for (const task of backlog.tasks) {
    const evidence = loadEvidence(root, task.id);
    assert.equal(evidence.task_contract_hash, taskContractHash(task), `${task.id} contract drifted`);
    assert.ok(evidence.checks.some((check) => check.phase === "red" && check.exit_code !== 0), `${task.id} has no failing RED run`);
    const gate = evaluateTransition({ root, task: { ...task, state: "review" }, to: "done" });
    assert.deepEqual(gate.errors, [], task.id);
  }
});

test("example published assets satisfy the asset schema", () => {
  const dir = paths.assets;
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md"));
  assert.ok(files.length >= 1);
  for (const name of files) {
    const parsed = parseFrontmatter(fs.readFileSync(path.join(dir, name), "utf8"));
    assert.equal(parsed.frontmatter.status, "published", name);
    assert.deepEqual(validateAsset(parsed.frontmatter, parsed.body), [], name);
  }
});

test("example project's own test suite passes", () => {
  const run = spawnSync(process.execPath, ["--test", "test/slugify.test.js"], { cwd: root, encoding: "utf8" });
  assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`);
});
