---
name: "speckit-storiestoissues"
description: "Convert the user stories in a feature spec.md into human-ready, approval-gated GitHub issues (one parent issue per story), ready for a human to approve via label. Output content is written in the project language (PT-BR for this project); technical task breakdown stays in tasks.md and may be attached as GitHub sub-issues."
argument-hint: "Optional: feature dir or filter, e.g. 001-login-demo"
compatibility: "Requires spec-kit project structure with .specify/ directory and a generated spec.md"
metadata:
  author: "gustavoparolin"
  source: "custom — Caminho B (approval-gated, human-readable issues)"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). It may name the target feature directory (e.g. `001-login-demo`) or a label filter.

## When this runs (position in the flow — approval gate is EARLY)

```
/speckit-specify → /speckit-clarify → [THIS SKILL] → ⛔ HUMAN APPROVES → /speckit-plan → /speckit-tasks → /speckit-taskstoissues → /speckit-implement
```

This skill runs **right after `/speckit-clarify`**, before any technical planning. The point is the **early approval gate**: the human approves the story (the what/why) *before* plan/tasks exist, so no planning is wasted on rejected stories. The child sub-issues (the technical tasks) are attached **later**, after approval, by `/speckit-taskstoissues` — they do not exist yet when this skill runs.

## Purpose & contrast with `speckit-taskstoissues`

- `speckit-taskstoissues` reads `tasks.md` and creates **one issue per technical task** (dependency-ordered) — runs **after** approval, attaching children to the parent.
- **This skill** reads `spec.md` and creates **one human-ready parent issue per user story** — runs **before** approval, for a human to approve (apply the approval label) or send back for rework.
- The two are complementary across the gate: **parent story issue (pre-approval)** ↔ **child task sub-issues (post-approval)**.

## Language rule

The skill instructions are in English; the **generated issue content MUST be written in the project's language**. For this project that is **PT-BR** (see `CLAUDE.md` / constitution). Do not emit English issue bodies for a PT-BR project.

## Pre-Execution Checks

**Check for extension hooks (before stories-to-issues conversion)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_storiestoissues` key.
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally.
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable.
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation.
- When constructing slash commands from hook command names, replace dots (`.`) with hyphens (`-`).
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently.

## Outline

1. Resolve the feature. Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from the repo root and parse `FEATURE_DIR` and `AVAILABLE_DOCS`. All paths must be absolute. If the user input names a feature (e.g. `001-login-demo`), target that directory instead.

2. **IF EXISTS**: Load `.specify/memory/constitution.md` for governance constraints — in particular the **approval-gated rule** (the agent never marks an issue as approved; only a human does).

3. Read `spec.md` from `FEATURE_DIR`. Extract each **user story** (the spec template uses headings like `História N — <título> (Prioridade: PX)`), its narrative, its **acceptance scenarios** (Given/When/Then), edge cases, and the feature-level scope and success criteria.

4. Get the Git remote:

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> ONLY PROCEED IF THE REMOTE IS A GITHUB URL. UNDER NO CIRCUMSTANCES CREATE ISSUES IN A REPOSITORY THAT DOES NOT MATCH THE REMOTE URL.

5. **Discover labels (do not hardcode).** Run `gh label list`. Identify:
   - the **user-story classification** label (e.g. `historia-usuario`),
   - any **scope** labels that apply (e.g. `mvp`, `pos-mvp`),
   - the **initial status** label of the approval flow (e.g. `aguardando-aprovacao`),
   - the **approval trigger** label (e.g. `aprovado`).
   If the expected labels do not exist in this repo, fall back gracefully: apply only the labels that exist, and report which were missing (do not invent the approval workflow for a project that doesn't use it).

> [!CAUTION]
> NEVER apply the approval-trigger label (`aprovado`). That label is reserved for a human. The agent only ever sets the initial status (or lets a repo Action set it).

6. For **each user story**, create one GitHub issue using the **Issue body template** below. Title: a short human phrase (the story title), not a task. Apply the user-story + scope labels. If the repo has a GitHub Action that auto-applies the initial status label on issue creation, do not also apply it; otherwise apply the initial status label yourself.

7. **(Optional) Parent ↔ child sub-issues.** If `tasks.md` exists and the user asks for the technical breakdown in GitHub, create the task issues (or reuse `speckit-taskstoissues`) and attach them as **sub-issues** of the matching story issue via the GitHub sub-issues API (`gh api`, REST: `POST /repos/{owner}/{repo}/issues/{parent}/sub_issues`). The parent stays the human-approved story; children are the implementation tasks. Verify the exact API shape before calling.

8. Report each created issue (number + URL + which labels) and **explicitly remind the human** that nothing will be implemented until they add the approval label to the parent issue(s).

## Issue body template (write the actual content in the project language — PT-BR here)

```markdown
## História de usuário

> **Como** <ator>,
> **quero** <ação>,
> **para** <benefício>.

## Contexto e por que importa

<2–4 frases em linguagem de negócio: qual problema resolve, por que agora, dependências relevantes.>

## O que o usuário vai poder fazer

- <capacidade observável 1, em linguagem de usuário>
- <capacidade observável 2>
- <...>

## Critérios de aceite

<Lista NUMERADA, em PT-BR claro, derivada dos cenários Given/When/Then da spec. SEM checkbox.>
1. <Quando ..., então ...>
2. <...>

## Escopo

**Dentro desta entrega:** <em termos de usuário>
**Fora (próximos Issues):** <...>

## Referências

- Especificação completa (requisitos e detalhamento técnico): `specs/<NNN-nome>/spec.md`

---

### Como decidir este Issue

- **Para aprovar e liberar o desenvolvimento:** adicione a label `<aprovado>`.
- **Para pedir mudanças:** comente o que ajustar — o fluxo troca para `<ajuste-solicitado>` e a IA refaz a spec antes de implementar.
```

## Hard rules

- One parent issue **per user story**, not per task.
- Runs **before** the approval gate (after `/speckit-clarify`); plan/tasks come **after** approval.
- Issue body in the **project language** (PT-BR here); skill stays in English.
- **Never** self-approve (never apply the approval-trigger label).
- Never target a repo other than the Git remote.
- Keep the technical task breakdown out of the parent body — it lives in `tasks.md`, attached later as **sub-issues** by `speckit-taskstoissues`.

## Caminho B note (issue-first)

A human may also create an issue **manually** and approve it directly, without this skill. In that case the agent must **detect an `aprovado` issue that has no matching spec in `specs/`** and create the spec from the issue **before** planning or implementing. This skill is for the spec-first path (Caminho A); the manual path is still valid and must be honored.

## Post-Execution Checks

**Check for extension hooks (after stories-to-issues conversion)**:
- Check if `.specify/extensions.yml` exists; look under `hooks.after_storiestoissues`.
- Same parsing/condition/enabled rules as the pre-execution hooks above.
- If none are registered or the file does not exist, skip silently.
