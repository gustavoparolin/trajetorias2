---
name: "speckit-peer-review"
description: "Peer-review the PR/branch of one implemented issue against its spec and acceptance criteria, code quality, security and the constitution principles. Produces a review report in the project language (PT-BR). Mode-aware: in MODO_CONTROLADO the human is the reviewer and this prepares the report; in MODO_AUTONOMO it self-reviews and approves or requests rework."
argument-hint: "Issue number or PR number, e.g. 3"
compatibility: "Requires spec-kit project structure; the issue must already have a PR/branch from speckit-implement"
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

Names the issue (and/or its PR) to review. If empty, review the PR of the issue currently in `em-implementacao`.

## Honest caveat (read first)

When the same agent implements and reviews, this is **self-review, not independent peer review** — it will not catch a blind spot the implementer shares. Its value comes from being a **separate pass with a different focus** (the reviewer reads the diff critically against the spec, not to make it work). It is most valuable as the **automated guardrail in MODO_AUTONOMO**, before an auto-merge. In `MODO_CONTROLADO`, the real reviewer is the **human**; this skill only prepares a report to speed their decision.

## What it does

1. Determine the **operation mode** (read "Modo de operação" in `CLAUDE.md`).
2. Resolve the issue + its PR/branch. Get the diff: `gh pr diff <PR>` (or `git diff main...<branch>`).
3. Read `specs/NNN-nome/spec.md` (user story + acceptance criteria), `plano.md`, and `.specify/memory/constitution.md`.
4. Review the diff against this rubric and write findings:
   - **Aderência à spec:** o código entrega a história e cada critério de aceite? Algo fora do escopo? (Princípio V — Simplicidade)
   - **Qualidade:** legibilidade, nomes, duplicação, tratamento de erro, consistência com o código vizinho.
   - **Segurança:** segredos no código? validação de entrada? dados sensíveis/PII expostos? (lembrar: CPF nunca, dados Oracle nunca commitados).
   - **Testes:** existem testes para a lógica e para a jornada? (Princípio III — Testes Primeiro)
   - **Idioma:** UI/mensagens em PT-BR? (Princípio IV)
   - **Convenções:** commits/branch/PR no padrão; sem `--no-verify`.
5. Produce a **review report in PT-BR** (the human reads it): veredito (Aprovado / Ajustes necessários), pontos fortes, e uma lista numerada de problemas com severidade (bloqueante / sugestão) e arquivo:linha.

## Output by mode

- **MODO_CONTROLADO:** post the report as a PR comment (`gh pr comment`) for the human to decide. Do **not** approve or merge. Status stays `em-implementacao`.
- **MODO_AUTONOMO:**
  - If no blocking issues: register approval (PR comment "peer-review: aprovado") and hand off to `speckit-qa`.
  - If blocking issues: hand back to `speckit-implement` to fix them within the same cycle, then re-review. If it cannot be fixed, switch the issue to `falha-ia`, stop, and report.

## Hard rules

- Single issue per run — no sweeping. The sweep/orchestration is `speckit-check-issues`.
- Report content in PT-BR; skill instructions in English.
- Never merge here. Merge is decided by the human (controlado) or by `speckit-check-issues` after QA (autônomo).
- Review against the spec's acceptance criteria, not against vibes.
