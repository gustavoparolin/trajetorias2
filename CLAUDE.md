# CLAUDE.md — Trajetórias 2.0

Instruções para o agente IA (Claude Code) neste repositório.
Estas instruções têm precedência sobre qualquer comportamento padrão.

## Regra fundamental: Approval-Gated

**O agente NUNCA implementa código sem um GitHub Issue com label `approved`.**

Fluxo obrigatório:
1. Ler a constitution: `.specify/memory/constitution.md`
2. Identificar Issues com label `approved` em `github.com/gustavoparolin/trajetorias2`
3. Escolher o Issue de maior prioridade (menor número ou milestone mais próximo)
4. Criar branch: `feat/issue-N-descricao-curta`
5. Implementar conforme spec em `specs/` e critérios de aceite do Issue
6. Executar: `npm test` → se falhar, corrigir antes de continuar
7. Executar: `npx playwright test` → se falhar, corrigir antes de continuar
8. Abrir PR com `Closes #N` no corpo
9. Não mergear — aguardar revisão do owner

**Se não houver Issue com label `approved`, parar e informar o usuário.**

## Idioma

- Todo o código de UI, mensagens, toasts e erros: PT-BR
- Commits, PRs e comentários: PT-BR
- Nomes de variáveis e funções: inglês (OK)

## Commits

```
feat(#N): descrição curta em PT-BR

Closes #N

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Quality gates (OBRIGATÓRIO antes de abrir PR)

```bash
npm run typecheck   # TypeScript sem erros
npm test            # Vitest — todos passando
npx playwright test # Playwright — todos passando
```

Nunca usar `--no-verify` ou pular hooks.

## Estrutura do projeto

```
trajetorias2/
├── packages/
│   ├── api/          Node.js 22 + TypeScript + Fastify + Prisma
│   └── web/          React 18 + Vite + TypeScript + Tailwind CSS
├── prisma/           schema.prisma + migrations
├── seed/             scripts de importação Oracle → PostgreSQL
├── e2e/              Playwright specs
├── specs/            Artefatos spec-kit por feature
│   └── NNN-feature/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── .specify/         Config e templates spec-kit
├── .github/agents/   Agentes spec-kit
└── tasks/            PRD e task lists de alto nível
```

## Spec-kit workflow

Para cada nova feature, rodar na ordem:
```
/speckit.specify → /speckit.clarify → /speckit.checklist
→ /speckit.plan → /speckit.tasks → /speckit.taskstoissues
→ (owner aprova Issues) → /speckit.implement
```

## Referências

- Constitution: `.specify/memory/constitution.md`
- PRD: `tasks/prd-trajetorias2.md`
- GitHub: `https://github.com/gustavoparolin/trajetorias2`
- API: `https://api-trajetorias2.parolin.net`
- Web: `https://trajetorias2.parolin.net`
