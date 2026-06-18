# Changelog — Trajetórias 2.0

Todas as mudanças relevantes do projeto são documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).
Versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Não lançado]

### Adicionado
- **Autenticação demo** (#3, História P1): modelo `Usuario`, seed dos 6 usuários demo, `POST /login` (JWT), `GET /eu`, `GET /usuarios-demo` — 8 testes Vitest
- **Frontend de login** (#3): `packages/web` (Vite + React 18 + TS + Tailwind 4), store Zustand, página de login com painel demo (clique-preenche), dashboard com nome no header e "Trocar usuário", proteção de rota
- **Testes E2E** Playwright (`e2e/login.spec.ts`): login servidor, senha errada, painel demo, rota protegida
- **Pipeline de skills** spec-kit: `check-issues` (orquestrador) → `implement` → `peer-review` → `qa`, com skill `storiestoissues` (Issue-pai = história) e portão de aprovação cedo
- **Deploy automático no Coolify** via GitHub Action a cada push na `main` (substitui o auto-deploy do GitHub App que parou de funcionar)

### Alterado
- API (`packages/api`) migrada de HTTP nativo (JS) para **Fastify + TypeScript** rodando via `tsx`
  - Estrutura modular: `src/app.ts`, `src/index.ts`, `src/prisma.ts`, `src/rotas/`
  - CORS via plugin `@fastify/cors` (origens de `FRONTEND_ORIGINS` em produção)
  - `tsconfig.json` em modo `strict`; script `typecheck` (`tsc --noEmit`)
  - Testes com Vitest (`src/app.test.ts`) — rotas de saúde sem dependência de banco
  - `start`: `prisma migrate deploy && node --import tsx src/index.ts`

---

## [0.2.0] — 2026-06-16

### Adicionado
- Constituição do projeto (`spec-kit`) em PT-BR v1.3.0 com 5 princípios fundamentais
- `CLAUDE.md` com instruções completas para o agente IA
- Fluxo de aprovação com 6 labels de status em PT-BR:
  `aguardando-aprovacao` · `ajuste-solicitado` · `aprovado` · `em-implementacao` · `concluido` · `falha-ia`
- Labels de classificação: `historia-usuario` · `mvp` · `pos-mvp` · `spec-kit` · `nao-implementar`
- 3 GitHub Actions para automação do ciclo de vida dos Issues:
  - `issue-criado.yml` — Issue aberto → `aguardando-aprovacao`
  - `ajuste-solicitado.yml` — Comentário humano com palavra-chave → `ajuste-solicitado`
  - `pr-mergeado-concluido.yml` — PR mergeado → `concluido`
- Agentes e prompts do spec-kit publicados em `.github/agents/` e `.github/prompts/`
- PRD do MVP em `tasks/prd-trajetorias2.md` (v0.2, perguntas abertas respondidas)
- Mockup APEX navegável (143 telas) em `mockup/` + link no header da landing page

### Corrigido
- `.github/` removido do `.gitignore` para habilitar GitHub Actions e spec-kit
- Constituição e CLAUDE.md traduzidos 100% para PT-BR

---

## [0.1.0] — 2026-06-15

### Adicionado
- Landing page em PT-BR com identidade visual ISC/TCU (navy/gold/green)
  - Efeito de mouse tracking no hero
  - Seções: Problema · Spec-kit · Jornadas · Roadmap
  - Link para GitHub no header
- Logomarca `logo-t2-horizontal.png` e `logo-t2-icon.png` com fundo transparente
- Favicons gerados: `favicon-32.png` · `apple-touch-icon.png` · `icon-192.png`
- API placeholder (`packages/api/`) com endpoints `GET /` e `GET /health`
  - Node.js 22 puro, sem dependências, ES modules
  - Deploy via Nixpacks no Coolify
- Monorepo npm workspaces (`packages/api` + `packages/web`)
- `.gitignore` configurado (`.estudo/`, `seed/oracle-exports/*.csv`, etc.)
- `README.md` em PT-BR com stack, arquitetura e histórico

### Infraestrutura configurada
- Repositório público: `github.com/gustavoparolin/trajetorias2`
- API em produção: `https://api-trajetorias2.parolin.net/health`
- Landing page: `https://trajetorias2.parolin.net`
- Coolify: `trajetorias2-api` rodando com Nixpacks + Node 22
- PostgreSQL: `postgresql-trajetorias2` no Coolify (aguardando conexão da API)
- Cloudflare Tunnel: `api-trajetorias2.parolin.net` → `https://localhost:443` + `noTLSVerify`
- Cloudflare Pages: deploy automático a cada push na `main`

### Corrigido
- Crash da API por referência a `Bun` não declarado em Node.js (`ReferenceError`)
- Porta exposta no Coolify corrigida de `3000` para `3001`
- Cloudflare Tunnel apontava para `http://localhost:80`; corrigido para `https://localhost:443`
- Build command do Cloudflare Pages estava com `/` (causava `Permission denied`)
- Removido Dockerfile — projeto usa Nixpacks (padrão nos outros projetos do Gustavo)

---

## Histórico de engenharia reversa (pré-projeto)

As fases 0–6 de análise do sistema Oracle APEX 18 estão documentadas em `.estudo/PROGRESSO.md`.
Os artefatos (mockups, manifests, PL/SQL indexado) estão em `.estudo/` (não versionado).

| Fase | Resultado |
|------|-----------|
| 0 | Validação dos CSVs — 17/17 arquivos carregados |
| 1 | 143 páginas mapeadas |
| 2 | 142 manifestos JSON gerados |
| 3 | Mockup navegável com 146 arquivos |
| 4 | 158 fichas PL/SQL + 111 triggers indexados |
| 5 | 12 fluxos de processo com diagramas Mermaid |
| 6 | Análise de decisão tecnológica completa |
