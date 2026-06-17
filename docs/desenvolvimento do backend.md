# Continuar o desenvolvimento do backend do Trajetórias 2.0

Você vai continuar o desenvolvimento do **Trajetórias 2.0** (sistema de trilhas de
competências do TCU). O backend já existe como esqueleto e a INFRAESTRUTURA DE PRODUÇÃO
JÁ ESTÁ NO AR — não recrie nada de infra. Seu trabalho é evoluir o código respeitando o
contrato abaixo.

> **Atenção ao fluxo de aprovação (ver `CLAUDE.md`):** este projeto é desenvolvido por
> aprovação. NUNCA implemente código sem um GitHub Issue com label `aprovado`. Sem o label,
> pare e informe o usuário. Este documento descreve *como* trabalhar o backend, não autoriza
> implementar nada por conta própria.

## Documentação da infra (LEIA antes de mexer em deploy/env)
- `docs/cloudflare-deployment-checklist.md` (checklist de deploy deste projeto)
- `X:\Obsidian\Brain\5.Reference\Technical\Oracle Always Free instance.md` (estado atual)
- `X:\Obsidian\Brain\5.Reference\Technical\Oracle VPS - Runbook setup.md` (como foi montado)
- `X:\Obsidian\Brain\5.Reference\Technical\Cloudflare - Novo subdominio por projeto.md`

## Repositório
- `gustavoparolin/trajetorias2` (monorepo npm workspaces). API em `packages/api/`.
- **Stack atual (real):** Node.js 22 + HTTP nativo (`node:http`) em JS puro
  (`packages/api/src/index.js`) + **Prisma 5**. O `index.js` ainda é placeholder evoluindo
  a cada Sprint.
- **Stack alvo (`CLAUDE.md`):** **Fastify + TypeScript + Prisma**. Migrar o HTTP nativo para
  Fastify/TS faz parte do trabalho do backend — feito de forma incremental, atrelado a Issues
  aprovados.

## Como o deploy funciona (NÃO mudar)
- **Push na `main` → auto-deploy** no Coolify (na VPS), via **Nixpacks** (sem Dockerfile —
  não criar um). Config no Coolify: Base Directory `/packages/api`, start `npm start`,
  Ports Exposes **3001**.
- `npm start` = `prisma migrate deploy && node src/index.js`.
- O servidor DEVE escutar em `0.0.0.0` na porta de `PORT` (já faz). Tem rota `/health`.
- A API é exposta pela internet via **Cloudflare Tunnel → Traefik** (ver checklist de deploy),
  não por porta aberta. Rota: `api-trajetorias2.parolin.net → https://localhost:443`
  (`noTLSVerify`).
- Produção: API em `https://api-trajetorias2.parolin.net`, frontend em
  `https://trajetorias2.parolin.net` (Cloudflare Pages).

## Contrato de configuração (tudo vem de ENV — definidas no Coolify, NÃO no .env commitado)
A app DEVE ler config do ambiente. Variáveis provisionadas em produção:
- `PORT` (3001), `NODE_ENV` (production), `DEMO_MODE` (true)
- `FRONTEND_ORIGINS` (CSV de origens p/ CORS — já usado no `index.js`)
- `DATABASE_URL` → PostgreSQL no VPS (database `trajetorias2`)
- `JWT_SECRET` → segredo para assinar os tokens de sessão do login demo
> NUNCA commite valores de secrets. Os valores reais vivem só no Coolify.
> Para dev local, use um `.env` com `localhost` (Postgres local), fora do git.
> Este projeto NÃO usa R2/S3 nem OAuth no MVP — não adicione essas dependências.

## Estado atual dos dados (já feito)
- `packages/api/prisma/schema.prisma`: 11 modelos (estrutura + transacional) — trajetória,
  nível, competência, comportamento, espaço ocupacional, pessoa, adesão, autoavaliação, etc.
- Migrations existem (`20260616000000_init`, `20260616000001_estrutura_completa`).
- **Importação Oracle**: `packages/api/seed/importar-todos.mjs` lê os CSVs de
  `seed/oracle-exports/` (gitignored — contêm dados de pessoas, NUNCA commitar) e popula o
  banco. Encoding Latin-1, delimitador `;` (formato APEX). Rodar no VPS via
  `docker exec -e CSV_DIR=/tmp/csvs <container> node /app/seed/importar-todos.mjs`.
- Endpoint `GET /trajetorias` já lê do Prisma e retorna trajetórias com seus níveis.

## O que falta implementar (sua tarefa principal — sempre via Issue aprovado)
MVP Sprint 1 (PRD): **Login → Aderir → Autoavaliar → Consultar minha posição.**
1. **Autenticação demo** (spec `001-login-demo`): login com matrícula + senha única `demo`,
   token assinado com `JWT_SECRET`, redirecionamento por perfil (USUARIO/GESTOR/ADMIN),
   proteção de rotas. Painel de usuários demo só com `DEMO_MODE=true`.
2. **Aderir a trajetória**: endpoint para um servidor aderir a uma trajetória (cria
   `PessoaTrajetoria`).
3. **Autoavaliar**: endpoint para registrar/atualizar o grau de domínio de um comportamento
   (`PessoaAutoavaliacao`).
4. **Consultar posição**: endpoint que devolve a posição atual do servidor (trajetória, nível,
   graus por competência/comportamento) para o dashboard.
5. **(Incremental) Migrar para Fastify + TypeScript** conforme o stack alvo do `CLAUDE.md`.

## Regras invioláveis
- **Desenvolvimento por aprovação**: só implementar Issues com label `aprovado` (ver `CLAUDE.md`).
- **Custo zero**: nada de serviços pagos. Postgres/Coolify rodam na VPS Always Free.
- **Domínios de 1 nível só**: `projeto.parolin.net` e `api-projeto.parolin.net`. NUNCA
  `api.projeto.parolin.net` (2 níveis quebram o SSL grátis).
- **CORS**: só via `FRONTEND_ORIGINS` (não hardcode).
- **PT-BR**: UI, mensagens, erros, commits, PRs, comentários, variáveis e rotas — tudo em
  português (ver `CLAUDE.md`).
- **Workflow**: conventional commits em PT-BR; rodar `typecheck`/`test` (vitest)/`playwright`
  antes de abrir PR; nunca usar `--no-verify`. PR com `Closes #N`, sem mergear (owner revisa).

## Definition of done (incremento)
- `npm run typecheck`, `npm test` (vitest) e `npx playwright test` passam.
- `/health` continua 200; `/trajetorias` retorna dados reais do Postgres `trajetorias2`.
- Login demo (`usuario.a` / `demo`) autentica e redireciona pelo perfil.
- Push na `main` → deploy automático verde no Coolify, sem quebrar o que já está no ar.
