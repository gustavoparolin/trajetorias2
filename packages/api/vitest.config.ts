import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // DATABASE_URL fictícia: o Prisma Client é instanciado mas os testes de
    // saúde não fazem queries, então nenhuma conexão real é aberta.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    },
  },
})
