<!--
Sync Impact Report
==================
Version change: (new) → 1.0.0
Added principles: I. Spec-First, II. Approval-Gated, III. Test-First, IV. Portuguese-First, V. Simplicity
Added sections: Stack & Deployment, Development Workflow, Governance
Templates updated: plan-template.md ✅, spec-template.md ✅, tasks-template.md ✅
Deferred TODOs: none
-->

# Trajetórias 2.0 — Constitution

## Core Principles

### I. Spec-First (NON-NEGOTIABLE)
Every feature MUST start as a spec-kit specification before any code is written.
The sequence is always: spec → clarify → plan → tasks → GitHub Issue (approved) → implement.
No issue may be opened without a corresponding spec artifact in `specs/`.
No implementation may begin without the issue carrying the `approved` label.

### II. Approval-Gated Development (NON-NEGOTIABLE)
The AI agent MUST only implement issues that carry the `approved` label.
Workflow:
1. Spec is completed and reviewed
2. Owner adds `approved` label to the GitHub Issue
3. AI agent picks up the issue, creates branch `feat/issue-N-description`, implements
4. AI runs `npm test` and `npx playwright test` — if either fails, no PR is opened
5. AI opens PR linking `Closes #N`, requests review
6. Owner reviews and merges; issue closes automatically

Issues without `approved` MUST be ignored by the AI agent, even if explicitly requested mid-session.

### III. Test-First (NON-NEGOTIABLE)
Tests MUST be written before implementation is considered complete.
- Every business function: Vitest unit test with edge cases
- Every user journey defined in the spec: Playwright E2E test (golden path + primary error)
- CI (GitHub Actions) MUST be green before any PR is opened
- The AI agent MUST run `npm test` and `npx playwright test` before opening a PR
- A PR that causes any test to fail MUST NOT be merged

### IV. Portuguese-First
All user-facing content MUST be in Brazilian Portuguese (PT-BR):
- UI labels, messages, toasts, error texts
- GitHub Issue titles and descriptions
- Commit messages (conventional: `feat(#N): descrição`)
- PR titles and descriptions
- Code comments (when needed)

Internal identifiers (variable names, function names, API routes) MAY be in English.

### V. Simplicity — YAGNI
Implement exactly what the approved issue specifies. No more.
- No features beyond the issue scope
- No premature abstractions (three similar lines > one abstraction)
- No backwards-compatibility shims for code that hasn't shipped yet
- No error handling for scenarios that cannot happen
- Complexity MUST be justified in the issue or plan; unjustified complexity is a reason to reject a PR

## Stack & Deployment

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Node.js 22 + TypeScript + Fastify + Prisma | `packages/api/` |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS | `packages/web/` |
| Database | PostgreSQL (Coolify, internal) | Schema in `prisma/schema.prisma` |
| Unit tests | Vitest | Co-located with source files |
| E2E tests | Playwright | `e2e/*.spec.ts` |
| API deploy | Coolify + Nixpacks | `api-trajetorias2.parolin.net` |
| Web deploy | Cloudflare Pages | `trajetorias2.parolin.net` |
| Storage | Cloudflare R2 | Post-MVP only |
| Routing | Cloudflare Tunnel → Traefik | `https://localhost:443` with `noTLSVerify` |

Environment variables are never committed. Secrets live in Coolify's Environment Variables tab.
`seed/oracle-exports/*.csv` is gitignored — never commit Oracle production data.

## Development Workflow

```
1. /speckit.specify  → creates specs/NNN-feature/spec.md
2. /speckit.clarify  → resolves ambiguities in spec.md
3. /speckit.checklist → validates spec quality gate
4. /speckit.plan     → creates specs/NNN-feature/plan.md
5. /speckit.tasks    → creates specs/NNN-feature/tasks.md
6. /speckit.taskstoissues → creates GitHub Issues from tasks.md
7. Owner reviews Issues → adds `approved` label
8. /speckit.implement → AI implements approved issue, runs tests, opens PR
9. Owner reviews PR → merges → issue closes
```

### Branch naming
```
feat/issue-N-short-description-in-kebab
fix/issue-N-short-description
```

### Commit format
```
feat(#N): descrição curta em PT-BR

Descrição longa se necessário.

Closes #N

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### PR format
```markdown
## Resumo
- Bullet points do que mudou

## Como testar
- [ ] Passos para verificar

## Critérios de aceite
- [ ] (copiados do issue)

Closes #N
```

## Governance

- This constitution supersedes all other practices and instructions
- Amendments require: new spec → discussion → ratification → version bump + date update
- The AI agent MUST verify compliance with all five principles before opening any PR
- MAJOR version: principle removed or fundamentally redefined
- MINOR version: new principle or section added
- PATCH version: clarifications, wording, non-semantic fixes
- All PRs must reference the issue they close; PRs without an issue reference are not allowed

**Version**: 1.0.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
