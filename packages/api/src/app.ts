import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { rotasSaude } from './rotas/saude'
import { rotasTrajetorias } from './rotas/trajetorias'
import { rotasAuth } from './rotas/auth'

// Claims do token de sessão.
export interface SessaoJwt {
  sub: number
  login: string
  nome: string
  perfil: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: SessaoJwt
    user: SessaoJwt
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    autenticar: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

/** Constrói a instância Fastify com CORS, JWT e rotas registradas. */
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

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'segredo-demo-trocar-em-producao',
  })

  // Decorator de proteção de rota: valida o Bearer token.
  app.decorate('autenticar', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch {
      reply.code(401).send({ erro: 'Não autenticado' })
    }
  })

  app.register(rotasSaude)
  app.register(rotasTrajetorias)
  app.register(rotasAuth)

  return app
}
