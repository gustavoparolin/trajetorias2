# Trajetórias 2.0

> Sistema de Gestão de Trajetórias Profissionais do TCU — nova geração

Modernização do Sistema Trajetórias do ISC/TCU (originalmente Oracle APEX 18, App 707625),
reconstruído com stack JavaScript moderno, dados reais de produção e foco em experiência de uso.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js 22 + Fastify + Prisma ORM |
| Banco de dados | PostgreSQL 18 (pgvector) |
| Infra | Oracle VPS (ARM 4 OCPU / 24 GB) + Coolify + Cloudflare |
| Deploy | Cloudflare Pages (web) + Cloudflare Tunnel (API) |

**Domínios:**
- Frontend: [trajetorias2.parolin.net](https://trajetorias2.parolin.net)
- API: [api-trajetorias2.parolin.net](https://api-trajetorias2.parolin.net)

---

## Como contribuir

1. Leia [`CONTRIBUTING.md`](./CONTRIBUTING.md)
2. Veja os [issues abertos](https://github.com/gustavoparolin/trajetorias2/issues) com label `approved`
3. Cada issue é uma **User Story** com critérios de aceite e notas técnicas

### Workflow do agente IA

```
ler issue aprovado → implementar → abrir PR → aguardar review → merge → fechar issue
```

Convenção de commits: `feat(#N): descrição curta em PT-BR`

---

## Rodando localmente

```bash
# Instalar dependências
npm install

# Subir banco de dados (Docker)
docker compose up -d

# Migrations
npx prisma migrate dev

# Seed de dados demo
npm run seed

# Iniciar (web + api em paralelo)
npm run dev
```

---

## Estrutura do projeto

```
trajetorias2/
├── packages/
│   ├── api/          Node.js 22 + Fastify + Prisma
│   └── web/          React + Vite + Tailwind
├── prisma/           Schema e migrations
├── seed/             Scripts de seed (demo + dados reais anonimizados)
├── docs/             Documentação técnica e MER
├── assets/           Logos, screenshots de referência
└── .estudo/          [.gitignore] Engenharia reversa APEX 18
```

---

## Contexto

O sistema original (APEX 18) foi mapeado por engenharia reversa:
- 143 páginas (69 normais + 73 modais + 1 global)
- 33 inconsistências catalogadas (E001–E033)
- 3 pacotes PL/SQL (~9.001 linhas)
- 52 tabelas AT_* no schema Atena (Oracle)

O novo sistema resolve os problemas estruturais e moderniza a experiência,
mantendo compatibilidade com os dados e as regras de negócio da Portaria TCU 130/2023.

---

## Licença

Uso interno ISC/TCU. Repositório público para fins de demonstração e colaboração do time NuPlan.
