import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Valores fictícios para os testes. O Prisma é mockado nos testes que
    // tocariam o banco, então nenhuma conexão real é aberta.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'segredo-de-teste',
    },
  },
})
