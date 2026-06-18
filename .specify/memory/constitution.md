<!--
Relatório de Sincronização
==========================
Mudança de versão: 1.3.0 → 2.0.0
Alterações: (1) portão de aprovação movido para CEDO (após /clarify, antes de plano/tarefas);
  introdução do skill speckit-storiestoissues (Issue-pai = história) e do modelo pai/filhas
  (sub-issues); Caminhos A e B unificados sob o mesmo portão; nomes de skills em hífen
  (Claude Code): /speckit-specify, etc. (2) Modos de operação: MODO_CONTROLADO (padrão, com
  portão) e MODO_AUTONOMO (owner concede autonomia total, sem portão humano; testes seguem
  inegociáveis).
Templates atualizados: nenhum impacto estrutural
Pendências: nenhuma

Patch 2.0.1: fluxo de ajuste (`ajuste-solicitado`) atualizado para o formato novo —
  a IA sincroniza spec E corpo do Issue (antes só o spec); os dois nunca divergem.
-->

# Trajetórias 2.0 — Constituição

## Princípios Fundamentais

### I. Especificação Primeiro (INEGOCIÁVEL)
Toda funcionalidade DEVE começar como uma especificação spec-kit antes de qualquer código ser escrito.
A sequência é sempre: spec → clarificação → Issue-pai (história) → **aprovação humana** → plano → tarefas → sub-issues → implementação.
O portão de aprovação vem **cedo**: o humano aprova a história (o quê e por quê) **antes** de qualquer planejamento técnico. Assim, plano e tarefas só são produzidos para histórias já aprovadas — nada de planejar o que pode ser rejeitado.
Nenhum Issue pode ser aberto sem um artefato de spec correspondente em `specs/` — exceto pelo Caminho B (veja Princípio II), em que a spec é criada **após** a aprovação.
Nenhuma implementação pode começar sem o Issue carregar o label `aprovado`.

### II. Desenvolvimento Controlado por Aprovação (INEGOCIÁVEL)
O agente IA DEVE implementar apenas Issues com label `aprovado` — **enquanto o projeto estiver em MODO_CONTROLADO** (padrão). O owner pode declarar **MODO_AUTONOMO**, em que a IA conduz tudo sem o portão humano (veja "Modos de operação" abaixo).
Cada Issue possui exatamente **1 label de status** por vez.

#### Modos de operação (o portão é condicional ao modo)
- **MODO_CONTROLADO** (padrão): vale o portão. A IA só implementa Issues com label `aprovado`.
- **MODO_AUTONOMO**: o owner concede autonomia total; a IA conduz spec → plano → tarefas → implementação → PR → merge **sem** esperar `aprovado`. As specs continuam sendo criadas (rastro), mas a IA aprova a si mesma.
- **Só o owner** ativa/desativa o modo, explicitamente — desde o início, a partir de um Issue, ou por Sprint. O modo vigente fica registrado no `CLAUDE.md` (seção "Modo de operação").
- Mesmo em MODO_AUTONOMO, o **Princípio III (Testes Primeiro) permanece inegociável**: typecheck + Vitest + Playwright DEVEM passar antes de qualquer merge. A autonomia remove o portão humano, não a rede de segurança dos testes.

#### Labels de status (ciclo de vida do Issue)

| Label | Cor | Significado | Próximo passo |
|-------|-----|-------------|---------------|
| `aguardando-aprovacao` | 🟡 ouro | Spec criado pela IA; aguarda validação humana | Humano aprova ou pede ajuste |
| `ajuste-solicitado` | 🔴 vermelho | Humano comentou pedindo mudanças | IA refaz a spec **e o Issue** → volta para `aguardando-aprovacao` |
| `aprovado` | 🔵 azul | Humano aprovou o spec | **Único gatilho** para desenvolvimento pela IA |
| `em-implementacao` | 🟣 marinho | Agente IA iniciou desenvolvimento | IA finaliza e abre PR |
| `concluido` | 🟢 verde | Implementação finalizada, PR mergeado | Fluxo encerrado |
| `falha-ia` | 🔴 vermelho escuro | IA não conseguiu implementar | Requer intervenção humana |

#### Regras de transição
- Apenas **1 label de status** por vez — trocar sempre remove o anterior
- `ajuste-solicitado` sempre substitui o label atual
- Ajuste = a IA atualiza **o spec E o corpo do Issue** (no formato novo o humano aprova o Issue, não o spec) → volta para `aguardando-aprovacao`. Spec e Issue nunca devem divergir.
- `aprovado` é o **único gatilho** para desenvolvimento
- PR mergeado → label vira `concluido`

#### Dois caminhos válidos

**Caminho A — Spec-First** (time técnico):
```
/speckit-specify → /speckit-clarify
→ /speckit-storiestoissues cria Issue-pai (história) com aguardando-aprovacao
→ (revisão humana) → aprovado          ← PORTÃO (cedo)
→ /speckit-plan → /speckit-tasks → /speckit-taskstoissues (sub-issues filhas)
→ IA implementa (em-implementacao) → PR → concluido
```

**Caminho B — Issue-First** (qualquer membro do time):
```
Humano cria Issue manualmente → responsável adiciona aprovado   ← PORTÃO (cedo)
→ IA detecta Issue aprovado SEM spec → cria specs/NNN-nome/spec.md a partir do Issue
→ /speckit-plan → /speckit-tasks → IA implementa (em-implementacao) → PR → concluido
```
No Caminho B, o agente DEVE perceber quando um Issue `aprovado` não tem spec correspondente em `specs/` e **criar a spec antes** de planejar ou implementar.

#### Fluxo com iteração
```
aguardando-aprovacao
  ↓ (humano comenta)
ajuste-solicitado
  ↓ (IA refaz spec)
aguardando-aprovacao
  ↓ (humano aprova)
aprovado
  ↓ (IA inicia)
em-implementacao
  ↓ (PR mergeado)
concluido
```

Em caso de erro: qualquer status → `falha-ia` → intervenção humana → retomar no status anterior.

Em **MODO_CONTROLADO**, Issues sem label `aprovado` DEVEM ser ignorados pelo agente, mesmo se solicitado explicitamente durante a sessão. Em **MODO_AUTONOMO** declarado pelo owner, essa restrição é suspensa.

### III. Testes Primeiro (INEGOCIÁVEL)
Testes DEVEM ser escritos antes de a implementação ser considerada completa.
- Toda função de negócio: teste unitário Vitest com casos de borda
- Toda jornada de usuário definida na spec: teste E2E Playwright (caminho feliz + erro principal)
- A integração contínua DEVE estar verde antes de qualquer PR ser aberto
- O agente IA DEVE executar `npm test` e `npx playwright test` antes de abrir um PR
- Um PR que cause falha em qualquer teste NÃO DEVE ser mergeado

### IV. Português Primeiro
Todo conteúdo visível ao usuário DEVE estar em Português Brasileiro (PT-BR):
- Labels de interface, mensagens, toasts, textos de erro
- Títulos e descrições de Issues no GitHub
- Labels do repositório (`aprovado`, `em-andamento`, `historia-usuario`, etc.)
- Mensagens de commit (convencional: `feat(#N): descrição`)
- Títulos e descrições de PRs
- Comentários de código (quando necessário)

Identificadores internos (nomes de variáveis, funções, rotas de API) PODEM estar em PT-BR ou inglês.

### V. Simplicidade — Não implemente o que não foi pedido
Implemente exatamente o que o Issue aprovado especifica. Nada além.
- Nenhuma funcionalidade além do escopo do Issue
- Nenhuma abstração prematura (três linhas parecidas > uma abstração desnecessária)
- Nenhum código de retrocompatibilidade para código que ainda não foi entregue
- Nenhum tratamento de erro para cenários que não podem ocorrer
- Complexidade DEVE ser justificada no Issue ou no plano; complexidade injustificada é motivo para rejeitar um PR

## Pilha Tecnológica e Infraestrutura

| Camada | Tecnologia | Observações |
|--------|-----------|-------------|
| Backend | Node.js 22 + TypeScript + Fastify + Prisma | `packages/api/` |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS | `packages/web/` |
| Banco de dados | PostgreSQL (Coolify, interno) | Schema em `prisma/schema.prisma` |
| Testes unitários | Vitest | Junto aos arquivos de código |
| Testes E2E | Playwright | `e2e/*.spec.ts` |
| Deploy da API | Coolify + Nixpacks | `api-trajetorias2.parolin.net` |
| Deploy do frontend | Cloudflare Pages | `trajetorias2.parolin.net` |
| Arquivos | Cloudflare R2 | Pós-MVP (evidências) |
| Roteamento | Cloudflare Tunnel → Traefik | `https://localhost:443` com `noTLSVerify` |

Variáveis de ambiente nunca são commitadas. Segredos ficam na aba de Variáveis de Ambiente do Coolify.
`seed/oracle-exports/*.csv` está no `.gitignore` — nunca commitar dados de produção Oracle.

## Fluxo de Desenvolvimento

```
Caminho A — Spec-First:
1. /speckit-specify          → cria specs/NNN-nome/spec.md (o quê e por quê, sem tech)
2. /speckit-clarify          → resolve ambiguidades na spec
3. /speckit-storiestoissues  → cria Issue-pai (história) no GitHub, human-ready
   ── ⛔ PORTÃO: responsável revisa e adiciona label `aprovado` ──
4. /speckit-plan             → cria specs/NNN-nome/plano.md (agora entra a stack)
5. /speckit-tasks            → cria specs/NNN-nome/tarefas.md
6. /speckit-analyze          → consistência entre spec/plano/tarefas (opcional)
7. /speckit-taskstoissues    → cria sub-issues (filhas) ligadas ao Issue-pai
8. /speckit-implement        → agente implementa, testa, abre PR
9. Responsável revisa PR → mergeia → Issue fecha

Caminho B — Issue-First:
1. Membro do time cria Issue manualmente no GitHub descrevendo o que quer
   ── ⛔ PORTÃO: responsável adiciona label `aprovado` ──
2. IA detecta Issue aprovado SEM spec → cria specs/NNN-nome/spec.md a partir do Issue
3. /speckit-plan → /speckit-tasks → /speckit-implement (implementa, testa, abre PR)
4. Responsável revisa PR → mergeia → Issue fecha
```

Em ambos os caminhos, o **portão de aprovação vem antes** de plano/tarefas/implementação.
O agente DEVE varrer os Issues `aprovado` e, se não houver spec correspondente em `specs/`, **criá-la antes** de prosseguir (Caminho B).

### Nomenclatura de branches
```
feat/issue-N-descricao-curta-em-kebab
fix/issue-N-descricao-curta
```

### Formato de commit
```
feat(#N): descrição curta em PT-BR

Descrição longa se necessário.

Closes #N

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### Formato de PR
```markdown
## Resumo
- Pontos do que mudou

## Como testar
- [ ] Passos para verificar

## Critérios de aceite
- [ ] (copiados do Issue)

Closes #N
```

## Governança

- Esta constituição tem precedência sobre todas as outras práticas e instruções
- Alterações requerem: discussão → ratificação → incremento de versão + atualização de data
- O agente IA DEVE verificar conformidade com os cinco princípios antes de abrir qualquer PR
- Versão MAIOR: princípio removido ou redefinido de forma incompatível
- Versão MENOR: novo princípio ou seção adicionados
- Versão PATCH: clarificações, redação, correções sem impacto semântico
- Todo PR DEVE referenciar o Issue que fecha; PRs sem referência de Issue não são permitidos

**Versão**: 2.0.1 | **Ratificado**: 2026-06-16 | **Última alteração**: 2026-06-17
