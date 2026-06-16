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

### II. Desenvolvimento Controlado por Aprovação (NON-NEGOTIABLE)
O agente IA DEVE implementar apenas Issues com label `aprovado`.

Dois caminhos válidos:

**Caminho A — Spec-First**: spec-kit gera spec → Issues criados → owner adiciona `aprovado` → agente implementa.

**Caminho B — Issue-First**: humano cria Issue no GitHub → owner adiciona `aprovado` → agente cria spec a partir do Issue → agente implementa.

Em ambos os casos:
1. Agente lê Issue com label `aprovado`, adiciona label `em-andamento`
2. Se spec não existir: agente cria `specs/NNN-nome/spec.md` a partir do Issue
3. Agente cria branch `feat/issue-N-descricao`, implementa
4. Agente executa `npm test` e `npx playwright test` — falha = não abre PR
5. Agente abre PR com `Closes #N`, aguarda revisão
6. Owner revisa e mergeia; Issue fecha automaticamente

Issues sem label `aprovado` DEVEM ser ignorados pelo agente, mesmo se solicitado explicitamente.

### III. Test-First (NON-NEGOTIABLE)
Tests MUST be written before implementation is considered complete.
- Every business function: Vitest unit test with edge cases
- Every user journey defined in the spec: Playwright E2E test (golden path + primary error)
- CI (GitHub Actions) MUST be green before any PR is opened
- The AI agent MUST run `npm test` and `npx playwright test` before opening a PR
- A PR that causes any test to fail MUST NOT be merged

### IV. Português-Primeiro
Todo conteúdo visível ao usuário DEVE estar em Português Brasileiro (PT-BR):
- Labels da UI, mensagens, toasts, textos de erro
- Títulos e descrições de Issues no GitHub
- Labels do repositório (`aprovado`, `em-andamento`, `historia-usuario`, etc.)
- Mensagens de commit (convencional: `feat(#N): descrição`)
- Títulos e descrições de PRs
- Comentários de código (quando necessário)

Identificadores internos (nomes de variáveis, funções, rotas de API) PODEM ser em PT-BR ou inglês.

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
Caminho A — Spec-First:
1. /speckit.specify       → cria specs/NNN-nome/spec.md
2. /speckit.clarify       → resolve ambiguidades na spec.md
3. /speckit.checklist     → valida qualidade da spec (gate)
4. /speckit.plan          → cria specs/NNN-nome/plano.md
5. /speckit.tasks         → cria specs/NNN-nome/tarefas.md
6. /speckit.taskstoissues → cria Issues no GitHub a partir das tarefas
7. Owner revisa Issues → adiciona label `aprovado`
8. /speckit.implement     → agente implementa, testa, abre PR
9. Owner revisa PR → mergeia → Issue fecha

Caminho B — Issue-First:
1. Humano cria Issue no GitHub descrevendo o que quer
2. Owner adiciona label `aprovado`
3. /speckit.implement     → agente cria spec + implementa + testa + abre PR
4. Owner revisa PR → mergeia → Issue fecha
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

**Versão**: 1.1.0 | **Ratificado**: 2026-06-16 | **Última alteração**: 2026-06-16
