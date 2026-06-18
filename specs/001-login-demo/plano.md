# Plano Técnico — Login Demo (Issue #3 / História P1)

**Spec:** [spec.md](spec.md) · **Issue:** #3 — Servidor acessa o sistema · **Branch:** `feat/issue-3-login-servidor`

> Escopo deste plano: entregar a **História 1 (P1)**. A infraestrutura de login (auth no backend + app frontend) é compartilhada e nasce aqui; #4 (gestor) e #5 (troca) reaproveitam.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Fastify + TypeScript + Prisma (já existe) |
| Auth | `@fastify/jwt` (token) + `bcryptjs` (hash de senha) |
| Frontend | React 18 + Vite + TypeScript + Tailwind (novo, em `packages/web`) |
| Estado | Zustand (store de sessão) |
| Testes | Vitest (backend) + Playwright (E2E) |

## Modelo de dados

Novo modelo **`Usuario`** (distinto de `Pessoa`, que vem do Oracle e não tem login):

```
Usuario
  id          Int      @id @default(autoincrement())
  login       String   @unique          // "usuario.a", "gestor.d", ...
  senhaHash   String                    // bcrypt de "demo"
  nome        String                    // exibido no header
  perfil      String                    // USUARIO | GESTOR | ADMIN
  chefeId     Int?                      // hierarquia (A→B,C; chefes D,E)
  chefe       Usuario? @relation("Hierarquia", fields:[chefeId], references:[id])
  subordinados Usuario[] @relation("Hierarquia")
```

Migration nova + seed dos **6 usuários demo** (senha = hash de `demo`):
`usuario.a/b/c` (USUARIO), `gestor.d/e` (GESTOR), `admin.isc` (ADMIN). Hierarquia: A tem chefes D,E; B,C subordinados de A.

## Backend — endpoints

- `POST /login` — body `{ login, senha }`. Valida senha (`bcrypt.compare`); se ok, retorna JWT `{ token }` com claims `{ sub: id, login, perfil, nome }`. Senha errada **ou** login inexistente → `401` com mensagem genérica (RF-004, não revela qual campo).
- `GET /eu` — requer `Authorization: Bearer <token>`; retorna `{ id, login, nome, perfil }`.
- `GET /usuarios-demo` — só quando `DEMO_MODE=true`; lista `{ login, perfil }` dos 6 (para o painel). Nunca retorna hash.

`JWT_SECRET` e `DEMO_MODE` vêm do ambiente (Coolify). CORS já configurado.

## Frontend — `packages/web`

- Scaffold Vite + React + TS + Tailwind. `VITE_API_BASE_URL`.
- **Store de sessão** (Zustand): token em `localStorage` (persistência — RF-010), usuário atual, ações `login/logout`.
- **Cliente de API**: fetch com base URL + header Authorization.
- **Página de Login**: campos "Usuário TCU" e "Senha"; **painel demo** (lista de `GET /usuarios-demo` + senha `demo`); clique no item preenche o campo (RF-006); erro genérico inline.
- **Dashboard do servidor**: header com o nome do usuário; conteúdo placeholder ("Minhas trajetórias" — próximas jornadas).
- **Proteção de rota**: rota do dashboard exige sessão; sem token → redireciona ao login (RF-009).
- Redirecionamento por perfil após login (USUARIO → dashboard servidor).

## Testes

- **Vitest (backend):** `POST /login` com `usuario.a`/`demo` → 200 + token; senha errada → 401; login inexistente → 401 genérico. `GET /eu` com/sem token.
- **Playwright (E2E):** login `usuario.a`/`demo` → dashboard com nome no header; senha errada → erro visível; painel demo visível e clique preenche o campo.

## Decisões e premissas

- Senha única `demo` (modo demonstração); hash mesmo assim (RF-004).
- `Usuario` demo é seedado, não vem do Oracle (ver memória `auth-usuario-nao-linkavel-siape`).
- Ligar usuário demo a dados reais de trajetória fica para as próximas jornadas (aderir/consultar).
- Sem SSO/Portal TCU neste MVP.
