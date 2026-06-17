# Checklist de Deploy — Cloudflare + Coolify (Trajetórias 2.0)

Este projeto é um monorepo (npm workspaces) com:
- Frontend SPA em `packages/web/` (React 18 + Vite + TypeScript + Tailwind)
- API backend em `packages/api/` (Node.js 22 + Prisma + PostgreSQL)

Modelo de deploy:
- Frontend → Cloudflare Pages
- API → Coolify no VPS Oracle Always Free
- **Deploy é MANUAL** (botão Redeploy no Coolify). O auto-deploy por push na `main` NÃO
  está configurado — um `git push` sozinho não atualiza produção. Para automatizar, seria
  preciso configurar o webhook do GitHub no Coolify.
- A API é exposta pela internet via **Cloudflare Tunnel → Traefik** (proxy do Coolify), não por porta aberta no VPS

URLs de produção:
- Frontend: https://trajetorias2.parolin.net (Cloudflare Pages)
- API: https://api-trajetorias2.parolin.net (Coolify no VPS)

Regra de domínio: sempre usar `projeto.parolin.net` e `api-projeto.parolin.net` (um nível só).
NUNCA `api.projeto.parolin.net` — dois subníveis quebram o certificado SSL gratuito.

Regra de custo: zero serviços pagos. Postgres + Coolify no VPS Always Free; Cloudflare Pages e Tunnel no plano gratuito.

## 1) Pré-requisitos

- Repositório GitHub conectado ao Cloudflare Pages (`gustavoparolin/trajetorias2`)
- API configurada no Coolify (deploy disparado MANUALMENTE pelo botão Redeploy)
- Build do frontend roda localmente:
  - `npm install`
  - `npm run build --workspace packages/web`

## 2) Configuração do Projeto no Cloudflare Pages

No Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git:

- Repositório: `gustavoparolin/trajetorias2`
- Branch de produção: `main`
- Root directory: `/` (deixar padrão)
- Framework preset: None (custom)

Configuração de build:
- Build command: `npm install && npm run build --workspace packages/web`
- Build output directory: `packages/web/dist`
- Node.js: usar a LTS mais recente disponível no Pages

## 3) Variáveis de Ambiente (Pages)

Adicionar nas configurações do projeto no Pages.

Ambiente de produção:
- `VITE_API_BASE_URL` = https://api-trajetorias2.parolin.net

Ambiente de preview:
- `VITE_API_BASE_URL` = https://api-trajetorias2.parolin.net (ou URL de backend de preview, se houver)

Importante:
- Variáveis com prefixo `VITE_` são expostas ao frontend no build. Nunca colocar segredos aí.

## 4) Domínio Customizado

- Frontend: `trajetorias2.parolin.net` (configurado no Cloudflare Pages)
- Habilitar "Always Use HTTPS"
- DNS gerenciado no Cloudflare

## 5) Requisitos de CORS na API

A API precisa permitir a(s) origem(ns) do frontend:
- Produção: https://trajetorias2.parolin.net
- Preview: https://<projeto>.pages.dev

A API lê as origens permitidas de `FRONTEND_ORIGINS` (separadas por vírgula). NÃO fazer hardcode de origens.
- Exemplo: `FRONTEND_ORIGINS=https://trajetorias2.parolin.net,https://trajetorias2.pages.dev`
- Em ambiente não-produção (`NODE_ENV != production`), a API libera qualquer origem para facilitar o dev.

Política mínima de CORS:
- Métodos: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

## 6) Deploy da API via Coolify

A API é deployada via Coolify no VPS Oracle Always Free. **O deploy é manual**: após o
`git push`, abrir o Coolify → app `trajetorias2-api` → botão **Redeploy** (o auto-deploy por
push não está configurado). O build leva ~2 min (Nixpacks).

Build: o Coolify usa **Nixpacks** (detecta Node.js automaticamente pelo script `start`). Não há Dockerfile neste projeto — não criar um.

Configuração no Coolify:
- Base Directory: `/packages/api`
- Start command: `npm start` (roda `prisma migrate deploy && node src/index.js`)
- Ports Exposes: `3001`
- O servidor escuta em `0.0.0.0` na porta de `PORT`
- Health check: `GET /health`

Variáveis de ambiente no Coolify (NUNCA commitadas — segredos vivem só no Coolify):
- `PORT` = 3001
- `NODE_ENV` = production
- `DEMO_MODE` = true
- `FRONTEND_ORIGINS` = https://trajetorias2.parolin.net (separadas por vírgula se houver mais)
- `DATABASE_URL` → PostgreSQL no VPS (banco: `trajetorias2`), gerenciado pelo Coolify
- `JWT_SECRET` → segredo para assinar os tokens de sessão do login demo

Para dev local: usar arquivo `.env` com valores de localhost (Postgres local). Nunca commitar `.env` (já está no `.gitignore`).

Migrations: `prisma migrate deploy` roda no startup (faz parte do `npm start`).

### Importação dos dados Oracle (seed inicial)

Os dados reais anonimizados vêm de CSVs exportados do Oracle (em `seed/oracle-exports/`, **gitignored** — contêm dados de pessoas, nunca commitar).

Para popular o banco após o primeiro deploy:
1. Copiar os CSVs para o VPS: `scp seed/oracle-exports/*.csv oracle-vps:/tmp/csvs/`
2. Rodar o import dentro do container da API:
   `sudo docker exec -e CSV_DIR=/tmp/csvs <container-api> node /app/seed/importar-todos.mjs`
3. O script lê com encoding Latin-1 e delimitador `;` (formato de export do APEX).

## 7) Roteamento via Cloudflare Tunnel → Traefik (crítico)

A API não fica exposta por porta pública no VPS. O acesso externo passa por:

`Internet → Cloudflare → cloudflared (Tunnel no VPS) → Traefik (proxy do Coolify) → container da API`

Configuração do Tunnel no VPS (arquivo de config do `cloudflared`):
- Rota: `api-trajetorias2.parolin.net` → `https://localhost:443`
- `noTLSVerify: true` (o Traefik tem cert interno; o TLS público é terminado no Cloudflare)

Armadilhas conhecidas (já resolvidas neste projeto):
- Apontar o tunnel para `http://localhost:80` causa redirect 302 do Traefik (HTTP→HTTPS). Use `https://localhost:443` com `noTLSVerify`.
- A porta em "Ports Exposes" no Coolify precisa bater com `PORT` (3001). Divergência → container sobe mas o proxy dá 404/502.

## 8) Autenticação (modo demonstração)

Este projeto roda em modo demo (`DEMO_MODE=true`):
- Sem SSO/OAuth externo. Não há Google OAuth nem Portal TCU neste MVP.
- Senha única `demo` para todos os usuários de demonstração.
- Sessão assinada com `JWT_SECRET` (segredo só no Coolify).
- O painel de usuários demo só aparece quando `DEMO_MODE=true`.

## 9) Checklist de Validação do Deploy

Após cada deploy, verificar:
- Build do Coolify verde; `GET /health` retorna 200
- Migrations do Prisma rodaram (tabelas existem no banco `trajetorias2`)
- `GET /trajetorias` retorna os dados importados (não vazio)
- Frontend carrega em trajetorias2.parolin.net e chama a API em api-trajetorias2.parolin.net
- Login demo (`usuario.a` / `demo`) autentica e redireciona pelo perfil
- Nenhum segredo exposto no bundle do frontend
- CORS: requisição do frontend de produção não é bloqueada

## 10) Procedimento de Rollback

Se o deploy do frontend falhar:
- Re-deploy do último build bom na lista de deployments do Cloudflare Pages

Se o deploy da API falhar:
- Rollback pelo Coolify (re-deploy da release anterior)
- Checar os logs de build do Coolify por erros de migration ou startup
- Logs do container: `sudo docker logs <container-api> --tail 50`

## 11) Docs de Referência da Infra (não mexer na infra sem ler)

- Instância Oracle Always Free: X:\Obsidian\Brain\5.Reference\Technical\Oracle Always Free instance.md
- Runbook de setup do VPS: X:\Obsidian\Brain\5.Reference\Technical\Oracle VPS - Runbook setup.md
- Setup de subdomínio no Cloudflare: X:\Obsidian\Brain\5.Reference\Technical\Cloudflare - Novo subdominio por projeto.md
