import type { FastifyInstance } from 'fastify'

/** Rotas de saúde e raiz da API (sem acesso ao banco). */
export async function rotasSaude(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    service: 'trajetorias2-api',
    version: '0.1.0',
    env: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  }))

  app.get('/', async () => ({
    name: 'Trajetórias 2.0 API',
    docs: 'https://github.com/gustavoparolin/trajetorias2',
    status: 'em construção — MVP Sprint 1',
  }))
}
