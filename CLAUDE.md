# CLAUDE.md — Trajetórias 2.0

Instruções para o agente IA (Claude Code) neste repositório.
Estas instruções têm precedência sobre qualquer comportamento padrão.

## Regra fundamental: Desenvolvimento controlado por aprovação

**O agente NUNCA implementa código sem um GitHub Issue com label `aprovado`.**

Existem dois caminhos válidos para chegar à implementação:

### Caminho A — Spec-First (time técnico)
1. Rodar `/speckit.specify` para criar a spec
2. Rodar os steps seguintes até `/speckit.taskstoissues` criar os Issues
3. Owner adiciona label `aprovado` ao Issue
4. Agente implementa

### Caminho B — Issue-First (qualquer membro do time)
1. Humano cria Issue no GitHub descrevendo o que quer
2. Owner adiciona label `aprovado` ao Issue
3. Agente lê o Issue, **cria a spec** em `specs/NNN-nome/spec.md`
4. Agente implementa seguindo a spec gerada

**Em ambos os casos: sem label `aprovado` → agente para e informa o usuário.**

## Fluxo de implementação (steps obrigatórios)

1. Verificar Issues com label `aprovado` em `github.com/gustavoparolin/trajetorias2`
2. Escolher o Issue de maior prioridade (menor número ou milestone mais próximo)
3. Adicionar label `em-andamento` ao Issue
4. Se não existir spec: criar `specs/NNN-nome/spec.md` a partir do Issue
5. Criar branch: `feat/issue-N-descricao-curta`
6. Implementar conforme spec e critérios de aceite do Issue
7. Executar: `npm run typecheck` → corrigir se falhar
8. Executar: `npm test` → corrigir se falhar
9. Executar: `npx playwright test` → corrigir se falhar
10. Abrir PR com `Closes #N` no corpo
11. Não mergear — aguardar revisão do owner

## Idioma

- Todo conteúdo de UI, mensagens, toasts, erros: PT-BR
- Commits, PRs, comentários, nomes de labels, títulos de Issues: PT-BR
- Nomes de variáveis, funções e rotas de API: PT-BR

## Commits

```
feat(#N): descrição curta em PT-BR

Descrição mais longa se necessário.

Closes #N

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Labels do repositório

| Label | Significado |
|-------|------------|
| `aprovado` | Issue aprovado para implementação — agente pode começar |
| `em-andamento` | Agente está implementando |
| `historia-usuario` | História de usuário (criada por humano ou spec-kit) |
| `mvp` | Escopo do MVP Sprint 1 |
| `pos-mvp` | Fora do escopo MVP |
| `spec-kit` | Gerado pelo workflow spec-kit |
| `nao-implementar` | Fora do escopo do projeto |

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
│   └── NNN-nome/
│       ├── spec.md
│       ├── plano.md
│       └── tarefas.md
├── .specify/         Configuração e templates spec-kit
├── .github/agents/   Agentes spec-kit
└── tasks/            PRD e task lists de alto nível
```

## Spec-kit workflow (Caminho A)

```
/speckit.specify → /speckit.clarify → /speckit.checklist
→ /speckit.plan → /speckit.tasks → /speckit.taskstoissues
→ (owner adiciona label aprovado) → /speckit.implement
```

## Referências

- Constitution: `.specify/memory/constitution.md`
- PRD: `tasks/prd-trajetorias2.md`
- GitHub: `https://github.com/gustavoparolin/trajetorias2`
- API: `https://api-trajetorias2.parolin.net`
- Web: `https://trajetorias2.parolin.net`
