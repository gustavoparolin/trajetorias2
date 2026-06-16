<!--
Relatório de Sincronização
==========================
Mudança de versão: 1.1.0 → 1.2.0
Alterações: tradução completa para PT-BR
Templates atualizados: plano-template.md ✅, spec-template.md ✅, tarefas-template.md ✅
Pendências: nenhuma
-->

# Trajetórias 2.0 — Constituição

## Princípios Fundamentais

### I. Especificação Primeiro (INEGOCIÁVEL)
Toda funcionalidade DEVE começar como uma especificação spec-kit antes de qualquer código ser escrito.
A sequência é sempre: spec → clarificação → plano → tarefas → Issue no GitHub (aprovado) → implementação.
Nenhum Issue pode ser aberto sem um artefato de spec correspondente em `specs/` — exceto pelo Caminho B (veja Princípio II).
Nenhuma implementação pode começar sem o Issue carregar o label `aprovado`.

### II. Desenvolvimento Controlado por Aprovação (INEGOCIÁVEL)
O agente IA DEVE implementar apenas Issues com label `aprovado`.
Cada Issue possui exatamente **1 label de status** por vez.

#### Labels de status (ciclo de vida do Issue)

| Label | Cor | Significado | Próximo passo |
|-------|-----|-------------|---------------|
| `aguardando-aprovacao` | 🟡 ouro | Spec criado pela IA; aguarda validação humana | Humano aprova ou pede ajuste |
| `ajuste-solicitado` | 🔴 vermelho | Humano comentou pedindo mudanças | IA refaz a spec → volta para `aguardando-aprovacao` |
| `aprovado` | 🔵 azul | Humano aprovou o spec | **Único gatilho** para desenvolvimento pela IA |
| `em-implementacao` | 🟣 marinho | Agente IA iniciou desenvolvimento | IA finaliza e abre PR |
| `concluido` | 🟢 verde | Implementação finalizada, PR mergeado | Fluxo encerrado |
| `falha-ia` | 🔴 vermelho escuro | IA não conseguiu implementar | Requer intervenção humana |

#### Regras de transição
- Apenas **1 label de status** por vez — trocar sempre remove o anterior
- `ajuste-solicitado` sempre substitui o label atual
- Após a IA refazer a spec → volta para `aguardando-aprovacao`
- `aprovado` é o **único gatilho** para desenvolvimento
- PR mergeado → label vira `concluido`

#### Dois caminhos válidos

**Caminho A — Spec-First** (time técnico):
```
/speckit.specify → Issues criados com aguardando-aprovacao
→ (revisão humana) → aprovado
→ IA implementa (em-implementacao) → PR → concluido
```

**Caminho B — Issue-First** (qualquer membro do time):
```
Humano cria Issue → responsável adiciona aprovado
→ IA cria spec + implementa (em-implementacao) → PR → concluido
```

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

Issues sem label `aprovado` DEVEM ser ignorados pelo agente, mesmo se solicitado explicitamente durante a sessão.

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
1. /speckit.specify       → cria specs/NNN-nome/spec.md
2. /speckit.clarify       → resolve ambiguidades na spec
3. /speckit.checklist     → valida qualidade da spec (portão de qualidade)
4. /speckit.plan          → cria specs/NNN-nome/plano.md
5. /speckit.tasks         → cria specs/NNN-nome/tarefas.md
6. /speckit.taskstoissues → cria Issues no GitHub a partir das tarefas
7. Responsável revisa Issues → adiciona label `aprovado`
8. /speckit.implement     → agente implementa, testa, abre PR
9. Responsável revisa PR → mergeia → Issue fecha

Caminho B — Issue-First:
1. Membro do time cria Issue no GitHub descrevendo o que quer
2. Responsável adiciona label `aprovado`
3. /speckit.implement     → agente cria spec + implementa + testa + abre PR
4. Responsável revisa PR → mergeia → Issue fecha
```

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

**Versão**: 1.3.0 | **Ratificado**: 2026-06-16 | **Última alteração**: 2026-06-16
