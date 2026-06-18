---
name: "speckit-qa"
description: "QA gate for one implemented issue: run the full quality gates (typecheck + Vitest + Playwright) and verify each acceptance criterion from the spec against the running app. Produces a pass/fail QA report in the project language (PT-BR). Mode-aware: prepares the report for the human in MODO_CONTROLADO; gates the auto-merge in MODO_AUTONOMO."
argument-hint: "Issue number or PR number, e.g. 3"
compatibility: "Requires spec-kit project structure; the issue must already pass peer-review"
metadata:
  author: "gustavoparolin"
  source: "custom — pipeline: implement → peer-review → qa → merge"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

Names the issue (and/or PR) to QA. If empty, QA the issue currently in `em-implementacao` that has passed peer-review.

## What it does

1. Determine the **operation mode** (read "Modo de operação" in `CLAUDE.md`).
2. Resolve the issue + its PR/branch; check out the branch.
3. **Run the quality gates** (Princípio III — inegociável, em qualquer modo):
   - `npm run typecheck`
   - `npm test` (Vitest)
   - `npx playwright test`
   Capture pass/fail and failing output.
4. **Verify each acceptance criterion** from `specs/NNN-nome/spec.md` (and the issue body): for each numbered criterion, confirm it holds against the built feature (via the E2E tests when they cover it, or by exercising the running app). Mark each `OK` / `FALHOU` with evidence.
5. Produce a **QA report in PT-BR**: veredito geral (Aprovado / Reprovado), tabela dos gates (typecheck/Vitest/Playwright) e a checagem critério-a-critério.

## Output by mode

- **MODO_CONTROLADO:** post the QA report as a PR comment for the human to decide the merge. Do **not** merge. Status stays `em-implementacao`.
- **MODO_AUTONOMO:**
  - If all gates pass and every acceptance criterion holds: report `Aprovado` and hand back to `speckit-check-issues`, which performs the merge and sets `concluido`.
  - If anything fails: hand back to `speckit-implement` to fix within the same cycle, then re-run QA. If it cannot be fixed, switch the issue to `falha-ia`, stop, and report.

## Hard rules

- The quality gates are **mandatory in every mode** — a failing gate is never waived (Princípio III). Autonomy removes the human approval gate, not the tests.
- Single issue per run — no sweeping. Orchestration is `speckit-check-issues`.
- Report content in PT-BR; skill instructions in English.
- Never `--no-verify`, never skip a gate. Never merge here.
- QA validates against the **spec's acceptance criteria**, not a general impression.
