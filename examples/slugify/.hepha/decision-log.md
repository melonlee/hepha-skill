# Hepha 决策日志

## 决策记录

### DEC-001 · TASK-002 · How to fold accented Latin letters

Why research: more than one credible approach, and the choice decides which inputs silently degrade.

| Option | Pros | Cons |
|---|---|---|
| A. `text.normalize("NFKD")` + remove `\p{M}` combining marks | Built into JS, zero dependencies, covers every precomposed letter + mark; NFKD also folds compatibility forms (`ﬁ` → `fi`, full-width `Ａ` → `A`) | Letters that are not "base + mark" stay as-is: `ø`, `ß`, `ł`, `æ` become separators |
| B. `normalize("NFD")` + remove marks | Same as A | Does not fold ligatures or full-width forms (probe: `ﬁnal ＡＢＣ` unchanged) |
| C. Hand-written lookup table | Can handle `ß` → `ss`, `ø` → `o` | Large, never complete, locale-dependent; contradicts SPEC-001 non-goal "no locale rules" |
| D. npm dependency (`slugify`, `transliteration`) | Broad coverage incl. non-Latin | Violates the zero-dependency constraint |

Probe run (Node 24):

```text
"Crème Brûlée à la carte" -> "creme-brulee-a-la-carte"
"ﬁnal ＡＢＣ"              -> "final-abc"     (NFD would keep "ﬁ" and "ＡＢＣ")
"Søren Kierkegaard"       -> "s-ren-kierkegaard"
"straße"                  -> "stra-e"
"Łódź"                    -> "odz"
```

Decision: **A**. It meets SPEC-001 (SC-004) with no dependency. The `ø`/`ß`/`ł` behaviour is accepted and documented as a limitation rather than patched with a partial table; revisit only if a real user needs those locales.
