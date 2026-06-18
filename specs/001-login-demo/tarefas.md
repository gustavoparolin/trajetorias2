# Tarefas — Login Demo (Issue #3 / História P1)

**Plano:** [plano.md](plano.md) · **Issue:** #3

Ordem por dependência. `[P]` = pode ser paralelizada.

## Fase 1 — Backend: dados + autenticação

- [ ] **T1** Modelo `Usuario` no Prisma + migration + seed dos 6 usuários demo (hash bcrypt de `demo`, hierarquia A→D,E)
- [ ] **T2** Dependências: `@fastify/jwt`, `bcryptjs` (+ `@types/bcryptjs`)
- [ ] **T3** `POST /login` (valida senha → JWT) + erro genérico 401
- [ ] **T4** `GET /eu` (protegida por JWT) e `GET /usuarios-demo` (só com `DEMO_MODE=true`)
- [ ] **T5** Testes Vitest: login ok / senha errada / login inexistente / `/eu` com e sem token

## Fase 2 — Frontend: scaffold + sessão

- [ ] **T6** Scaffold `packages/web`: Vite + React + TS + Tailwind + `VITE_API_BASE_URL`
- [ ] **T7** Cliente de API + store de sessão Zustand (token em localStorage, persistência)
- [ ] **T8** Roteamento + proteção de rota (sem token → login)

## Fase 3 — Frontend: telas

- [ ] **T9** Página de Login: campos + painel de usuários demo + clique-preenche + erro inline
- [ ] **T10** Dashboard do servidor: nome no header + redirecionamento por perfil

## Fase 4 — Testes E2E + fechamento

- [ ] **T11** Playwright: login servidor (happy path), senha errada, painel demo clica-preenche
- [ ] **T12** Quality gates (typecheck + Vitest + Playwright) + CHANGELOG + abrir PR `Closes #3`

## Critérios de aceite cobertos (da spec, História 1)

| Critério | Tarefas |
|---|---|
| 1. login `usuario.a`/`demo` → dashboard com nome | T1,T3,T9,T10 |
| 2. senha errada → erro claro | T3,T9 |
| 3. login inexistente → erro genérico | T3,T9 |
| 4. painel demo com 6 usuários + senha | T4,T9 |
| 5. clique no painel preenche campo | T9 |
