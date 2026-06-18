# CLAUDE.md — Trajetórias 2.0

Instruções para o agente IA (Claude Code) neste repositório.
Estas instruções têm precedência sobre qualquer comportamento padrão.

## Regra fundamental: Desenvolvimento controlado por aprovação

**O agente NUNCA implementa código sem um GitHub Issue com label `aprovado`.**

Existem dois caminhos válidos para chegar à implementação:

O **portão de aprovação vem cedo**: o humano aprova a história (o quê e por quê) **antes** de plano/tarefas/implementação. Nada de planejar o que pode ser rejeitado.

### Caminho A — Spec-First (time técnico)
1. Rodar `/speckit-specify` → `/speckit-clarify` para criar e refinar a spec
2. Rodar `/speckit-storiestoissues` → cria o Issue-pai (história) human-ready
3. Owner adiciona label `aprovado` ao Issue-pai  ← **portão (cedo)**
4. Agente roda `/speckit-plan` → `/speckit-tasks` → `/speckit-taskstoissues` (sub-issues filhas) → implementa

### Caminho B — Issue-First (qualquer membro do time)
1. Humano cria Issue manualmente no GitHub descrevendo o que quer
2. Owner adiciona label `aprovado` ao Issue  ← **portão (cedo)**
3. Agente **detecta** o Issue aprovado SEM spec → **cria a spec** em `specs/NNN-nome/spec.md` a partir do Issue
4. Agente roda `/speckit-plan` → `/speckit-tasks` → implementa seguindo a spec gerada

**Em ambos os casos: sem label `aprovado` → agente para e informa o usuário.**
**Sempre que houver um Issue `aprovado` sem spec correspondente em `specs/`, o agente DEVE criar a spec antes de planejar ou implementar.**

> A regra acima vale em **MODO_CONTROLADO**. Em **MODO_AUTONOMO**, o portão é dispensado — veja abaixo.

## Modo de operação

O projeto opera em um de dois modos, definido **somente pelo owner**:

- **MODO_CONTROLADO** (padrão): vale o portão de aprovação descrito acima — a IA só implementa Issues com label `aprovado`.
- **MODO_AUTONOMO**: o owner concede autonomia total. A IA conduz o fluxo inteiro (spec → clarify → plano → tarefas → implementação → PR → **merge**) **sem esperar** o label `aprovado`. As specs continuam sendo criadas, para rastro; a IA aprova a si mesma.

**Modo atual: `MODO_CONTROLADO`**

- O owner ativa/desativa explicitamente — alterando a linha "Modo atual" acima, ou instruindo na sessão. Pode valer desde o início, a partir de um ponto (ex.: "a partir do Issue #N") ou por escopo (ex.: "Sprint 1").
- Mesmo em `MODO_AUTONOMO`, os quality gates seguem **obrigatórios**: `npm run typecheck`, `npm test` e `npx playwright test` DEVEM passar antes de qualquer merge. Autonomia remove o portão humano, não os testes.
- Em `MODO_AUTONOMO`, a IA pode mergear o próprio PR; se um teste falhar sem conserto, troca o label para `falha-ia`, para e informa o owner.

## Ciclo de vida de um Issue (labels de status)

| Label | Quem aplica | Significado |
|-------|------------|-------------|
| `aguardando-aprovacao` | IA (automático) | Spec criado, aguarda validação humana |
| `ajuste-solicitado` | Humano | Pediu mudanças na spec — IA deve refazer |
| `aprovado` | Humano | **Único gatilho** para desenvolvimento |
| `em-implementacao` | IA (automático) | Agente iniciou o desenvolvimento |
| `concluido` | IA (automático) | PR mergeado, fluxo encerrado |
| `falha-ia` | IA (automático) | Erro — requer intervenção humana |

**Regra:** apenas 1 label de status por vez. Trocar sempre remove o anterior.

## Fluxo de implementação (steps obrigatórios)

1. Verificar Issues com label `aprovado` em `github.com/gustavoparolin/trajetorias2`
2. Escolher o Issue de maior prioridade (menor número ou milestone mais próximo)
3. Trocar label para `em-implementacao` (remover `aprovado`)
4. Garantir os artefatos da spec antes de codar:
   - Se **não existir** `specs/NNN-nome/spec.md` (Caminho B): criar a spec a partir do Issue
   - Rodar `/speckit-plan` e `/speckit-tasks` se `plano.md`/`tarefas.md` ainda não existirem
5. Criar branch: `feat/issue-N-descricao-curta`
6. Implementar conforme spec e critérios de aceite do Issue
7. Executar: `npm run typecheck` → corrigir se falhar
8. Executar: `npm test` → corrigir se falhar
9. Executar: `npx playwright test` → corrigir se falhar
   - Se algum teste falhar após tentativas de correção: trocar label para `falha-ia`, parar e informar o usuário
10. Abrir PR com `Closes #N` no corpo (PR mergeado → GitHub fecha o Issue → label vira `concluido`)
11. Não mergear — aguardar revisão do owner

## Fluxo de ajuste de spec (quando label é `ajuste-solicitado`)

1. Ler comentários do Issue para entender o que mudar
2. Atualizar `specs/NNN-nome/spec.md`
3. Comentar no Issue descrevendo o que foi ajustado
4. Trocar label de `ajuste-solicitado` para `aguardando-aprovacao`
5. Aguardar nova aprovação humana — não implementar ainda

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

**Status (apenas 1 por vez):**

| Label | Cor | Significado |
|-------|-----|------------|
| `aguardando-aprovacao` | 🟡 | Spec criado pela IA, aguarda validação |
| `ajuste-solicitado` | 🔴 | Humano pediu mudanças na spec |
| `aprovado` | 🔵 | Aprovado — gatilho para desenvolvimento |
| `em-implementacao` | 🟣 | IA está desenvolvendo |
| `concluido` | 🟢 | PR mergeado, encerrado |
| `falha-ia` | 🔴 | Erro na IA, requer intervenção humana |

**Classificação (podem coexistir com status):**

| Label | Significado |
|-------|------------|
| `historia-usuario` | História de usuário |
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

## Spec-kit workflow (Caminho A) — portão de aprovação cedo

```
/speckit-specify → /speckit-clarify
→ /speckit-storiestoissues          (cria Issue-pai = história, human-ready)
→ ⛔ owner adiciona label `aprovado`  (PORTÃO, antes do trabalho técnico)
→ /speckit-plan → /speckit-tasks → /speckit-analyze (opcional)
→ /speckit-taskstoissues            (cria sub-issues filhas, ligadas ao pai)
→ /speckit-implement
```

- `speckit-storiestoissues`: **spec.md → Issue-pai por história** (para o humano aprovar).
- `speckit-taskstoissues`: **tarefas.md → sub-issues filhas** (para o agente implementar), após a aprovação.
- Nomes de skills usam hífen no Claude Code (`/speckit-*`). O agente nunca aplica `aprovado` — é gatilho exclusivo do humano.

## Referências

- Constitution: `.specify/memory/constitution.md`
- PRD: `tasks/prd-trajetorias2.md`
- GitHub: `https://github.com/gustavoparolin/trajetorias2`
- API: `https://api-trajetorias2.parolin.net`
- Web: `https://trajetorias2.parolin.net`
