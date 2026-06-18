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

## Fluxo de implementação — orquestrado por `/speckit-check-issues`

O **ponto de entrada** é `/speckit-check-issues`. Ele varre os Issues abertos e **delega** para os skills focados (não coda nada por si). Pipeline: `implement → peer-review → qa → merge`.

**Fase 1 — `ajuste-solicitado`:** reescreve (spec + corpo do Issue → `aguardando-aprovacao`, ver "Fluxo de ajuste"). Não implementa.

**Fase 2 — drive-to-done (um Issue por vez):**
1. Conjunto: `MODO_CONTROLADO` → Issues `aprovado`; `MODO_AUTONOMO` → também `aguardando-aprovacao` (portão dispensado)
2. Ordem: prioridade (P1→P2→P3, depois menor número), **respeitando dependências**
3. `em-implementacao` (remove o label anterior)
4. Garantir artefatos: criar `spec.md` se faltar (Caminho B); rodar `/speckit-plan` + `/speckit-tasks` se faltarem
5. **`speckit-implement`** → código + testes + PR com `Closes #N`
6. **`speckit-peer-review`** → revisa o PR
7. **`speckit-qa`** → roda os gates + valida cada critério de aceite
8. **Merge:** `MODO_CONTROLADO` → não mergeia; deixa o PR + relatórios para o owner. `MODO_AUTONOMO` → mergeia se review aprovou e QA passou (→ `concluido`)
9. Falha sem conserto em qualquer etapa → `falha-ia`, para esse Issue e segue para o próximo

**Labels enxutas:** não há `em-revisao`/`em-qa` — peer-review e QA rodam **dentro** do ciclo `em-implementacao`. Ciclo de vida: `aprovado → em-implementacao → concluido` (+ `ajuste-solicitado`, `falha-ia`).

**Quality gates (Princípio III — inegociável em TODO modo):** `npm run typecheck`, `npm test`, `npx playwright test`. Nunca `--no-verify`.

**Os 4 skills:** `check-issues` (orquestra) · `implement` (um feature + PR) · `peer-review` (revisa) · `qa` (valida critérios + gates).

## Fluxo de ajuste (quando label é `ajuste-solicitado`)

No formato novo, o humano revisa e aprova o **Issue (a história)** — então um ajuste precisa atualizar **o Issue E o spec**, mantendo os dois em sincronia.

1. Ler os comentários do Issue (e o corpo, se o humano o reescreveu) para entender o que mudar
2. Atualizar `specs/NNN-nome/spec.md` — a história e os critérios correspondentes
3. Atualizar o **corpo do Issue** para refletir a mudança (regenerar via `speckit-storiestoissues` ou editar com `gh issue edit`) — o Issue é o que o humano relê para reaprovar
4. Comentar no Issue descrevendo o que foi ajustado
5. Trocar o label de `ajuste-solicitado` para `aguardando-aprovacao`
6. Aguardar nova aprovação humana — não implementar ainda

**Notas:**
- O ajuste normalmente ocorre **antes** da aprovação (portão cedo), quando só existem spec + Issue — nada de plano/tarefas para sincronizar. Se o ajuste vier **depois** da aprovação (já há plano/tarefas/sub-issues), revisar também esses artefatos.
- **Sincronia spec ↔ Issue:** se o humano **reescreveu o Issue** diretamente, reconciliar o `spec.md` a partir do Issue; se pediu por comentário, atualizar ambos. Os dois nunca devem divergir.

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
→ /speckit-check-issues             (orquestra: plan → tasks → implement → peer-review → qa → merge)
```

- `speckit-storiestoissues`: **spec.md → Issue-pai por história** (para o humano aprovar).
- `speckit-check-issues`: **orquestrador** pós-aprovação — garante plano/tarefas e dispara implement → peer-review → qa → merge (drive-to-done, consciente do modo).
- `speckit-taskstoissues`: **tarefas.md → sub-issues filhas** — opcional, para visibilidade da quebra técnica.
- Nomes de skills usam hífen no Claude Code (`/speckit-*`). O agente nunca aplica `aprovado` — é gatilho exclusivo do humano.

## Referências

- Constitution: `.specify/memory/constitution.md`
- PRD: `tasks/prd-trajetorias2.md`
- GitHub: `https://github.com/gustavoparolin/trajetorias2`
- API: `https://api-trajetorias2.parolin.net`
- Web: `https://trajetorias2.parolin.net`
