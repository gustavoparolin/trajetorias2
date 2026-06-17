import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { rotasSaude } from './rotas/saude'
import { rotasTrajetorias } from './rotas/trajetorias'

/** Constrói a instância Fastify com CORS e rotas registradas. */
export function construirApp(): FastifyInstance {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
  })

  const origensPermitidas = (process.env.FRONTEND_ORIGINS ?? '')
    .split(',')
    .map((origem) => origem.trim())
    .filter(Boolean)

  app.register(cors, {
    // Em produção, restringe às origens configuradas; fora dela, libera tudo (dev).
    origin: process.env.NODE_ENV === 'production' ? origensPermitidas : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.register(rotasSaude)
  app.register(rotasTrajetorias)

  return app
}
