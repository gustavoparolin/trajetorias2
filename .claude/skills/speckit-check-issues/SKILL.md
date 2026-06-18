---
name: "speckit-check-issues"
description: "Orchestrator / entry point. Sweep open GitHub issues by status label and drive each through the pipeline: rewrite ajuste-solicitado issues, then take approved issues end-to-end (implement → peer-review → qa → merge) one at a time, in priority and dependency order. Mode-aware (MODO_CONTROLADO / MODO_AUTONOMO). Delegates the real work to the focused skills; does not implement code itself."
argument-hint: "Optional issue filter, e.g. 3 or mvp"
compatibility: "Requires spec-kit project structure with .specify/ and the speckit-implement / speckit-peer-review / speckit-qa / speckit-storiestoissues skills"
metadata:
  author: "gustavoparolin"
  source: "custom — pipeline orchestrator"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

Optional filter (an issue number, a label, or empty for all open issues).

## Role

This is the **single reactive entry point**. You type `/speckit-check-issues`, it triages the open issues and **delegates** to the focused skills — it never writes feature code, reviews, or tests itself. It owns: the sweep, the status-label transitions, the drive-to-done sequencing, and the merge decision.

The pipeline (lean labels — no `em-revisao`/`em-qa`; review and QA run **inside** the `em-implementacao` cycle):

```
aprovado → em-implementacao → [implement → peer-review → qa] → merge → concluido
              ↑ ajuste-solicitado (rewrite → aguardando-aprovacao)        ↓ falha-ia
```

## Step 1 — determine the mode

Read the "Modo de operação" section of `CLAUDE.md`. `MODO_CONTROLADO` is the default.

## Step 2 — sweep

```bash
gh issue list --state open --json number,title,labels
```

Group the open issues by their single status label.

## Step 3 — Phase 1: `ajuste-solicitado` (rewrite, do not implement)

For each issue labeled `ajuste-solicitado`, run the **adjustment flow** (`CLAUDE.md` › "Fluxo de ajuste"):
1. Read the comments (and the issue body, if the human rewrote it).
2. Update `specs/NNN-nome/spec.md` **and** the issue body (via `speckit-storiestoissues` or `gh issue edit`) — keep them in sync.
3. Comment what was adjusted.
4. Switch the label to `aguardando-aprovacao`.

These do **not** proceed to implementation — they await human approval again.

## Step 4 — Phase 2: drive approved issues to done

**Implementable set by mode:**
- **MODO_CONTROLADO:** issues labeled `aprovado`.
- **MODO_AUTONOMO:** issues labeled `aprovado` **or** `aguardando-aprovacao` (the human gate is waived).

Order by priority (P1 → P2 → P3, then lowest issue number) and **respect dependencies** — never start an issue whose dependency is not yet delivered; do the dependency first.

For **each** issue, **one at a time, end-to-end** (drive-to-done):

1. Switch the label to `em-implementacao` (remove the previous status label).
2. **Ensure artifacts:** if `specs/NNN-nome/spec.md` is missing (Caminho B — issue created manually), create it from the issue first; then run `/speckit-plan` and `/speckit-tasks` if `plano.md` / `tarefas.md` are missing.
3. **Implement:** invoke `speckit-implement` (builds the feature, runs gates, opens the PR with `Closes #N`).
4. **Peer-review:** invoke `speckit-peer-review` for the issue.
5. **QA:** invoke `speckit-qa` for the issue.
6. **Merge decision (mode-aware):**
   - **MODO_CONTROLADO:** do **not** merge. Leave the PR open with the peer-review and QA reports attached, and tell the owner it is ready for review. The issue stays `em-implementacao` until the owner merges (PR merged → Action sets `concluido`).
   - **MODO_AUTONOMO:** if peer-review approved **and** QA passed, **merge the PR** (`gh pr merge --squash`); the merge closes the issue and the Action sets `concluido`.
7. **On failure** at any stage that cannot be fixed within the cycle: switch the issue to `falha-ia`, stop that issue, report, and move on to the next.

If nothing is pending in either phase, report **"nada pendente"** and finish.

## Step 5 — report

Summarize per issue: what was rewritten (Phase 1), and for each Phase 2 issue its outcome — implemented + PR # + peer-review verdict + QA verdict + (merged | awaiting owner | falha-ia).

## Hard rules

- **Delegate, don't do.** This skill orchestrates; the real work is in `speckit-implement` / `speckit-peer-review` / `speckit-qa` / `speckit-storiestoissues`.
- **Never** apply `aprovado` (human-only). Never merge in `MODO_CONTROLADO`.
- The quality gates (via `speckit-qa`) are mandatory in **every** mode — a failing gate is never waived.
- One issue fully through the pipeline before starting the next; respect dependencies.
- Reports and issue/PR content in PT-BR; skill instructions in English.
