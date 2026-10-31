# Hepha 任务 Backlog

**需求**：Ship a dependency-free slugify(text, options) utility for URL-safe slugs

机器事实源：`.hepha/backlog.json`。

## 任务

### TASK-001：Core slugify: lowercase, hyphen separators, input validation

- 状态：`done`
- 风险：`low`
- 模式：`full`
- Spec：SPEC-001
- 依赖：无

验收条件：

- AC-001：Given the text 'Hello, World!'；When slugify is called；Then it returns 'hello-world' (SC-001)
- AC-002：Given the text '  --Hepha   Forge__v2--  '；When slugify is called；Then it returns 'hepha-forge-v2' (SC-002)
- AC-003：Given null, 42 or undefined；When slugify is called；Then it throws a TypeError (SC-003)
- AC-004：Given text without ASCII letters or digits such as '!!!'；When slugify is called；Then it returns an empty string

### TASK-002：Fold accented Latin letters to ASCII

- 状态：`done`
- 风险：`medium`
- 模式：`full`
- Spec：SPEC-001
- 依赖：TASK-001

验收条件：

- AC-005：Given the text 'Crème Brûlée à la carte'；When slugify is called；Then it returns 'creme-brulee-a-la-carte' (SC-004)
- AC-006：Given non-Latin text such as '你好'；When slugify is called；Then it still returns an empty string (non-goal: no transliteration)

### TASK-003：Add maxLength option without a trailing hyphen

- 状态：`done`
- 风险：`low`
- 模式：`lite`
- Spec：SPEC-001
- 依赖：TASK-001

验收条件：

- AC-007：Given 'Small steps ship safely' and { maxLength: 12 }；When slugify is called；Then it returns 'small-steps' (SC-005)
- AC-008：Given maxLength 0, -1, 2.5 or '10'；When slugify is called；Then it throws a RangeError

