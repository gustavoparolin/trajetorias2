import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../prisma'

const demoAtivo = () => process.env.DEMO_MODE === 'true'

/** Rotas de autenticação (login demo + sessão). */
export async function rotasAuth(app: FastifyInstance) {
  // POST /login — matrícula + senha → token JWT
  app.post('/login', async (request, reply) => {
    const { login, senha } = (request.body ?? {}) as { login?: string; senha?: string }

    if (!login || !senha) {
      return reply.code(400).send({ erro: 'Informe usuário e senha.' })
    }

    const usuario = await prisma.usuario.findUnique({ where: { login } })
    // Mensagem genérica: não revela se o erro foi no usuário ou na senha (RF-004).
    const senhaOk = usuario && (await bcrypt.compare(senha, usuario.senhaHash))
    if (!usuario || !senhaOk) {
      return reply.code(401).send({ erro: 'Usuário ou senha inválidos.' })
    }

    const token = app.jwt.sign({
      sub: usuario.id,
      login: usuario.login,
      nome: usuario.nome,
      perfil: usuario.perfil,
    })

    return { token, usuario: { id: usuario.id, login: usuario.login, nome: usuario.nome, perfil: usuario.perfil } }
  })

  // GET /eu — usuário autenticado (a partir do token)
  app.get('/eu', { preHandler: app.autenticar }, async (request) => {
    const { sub, login, nome, perfil } = request.user
    return { id: sub, login, nome, perfil }
  })

  // GET /usuarios-demo — painel de demonstração (só com DEMO_MODE=true)
  app.get('/usuarios-demo', async (_request, reply) => {
    if (!demoAtivo()) {
      return reply.code(404).send({ erro: 'Indisponível.' })
    }
    const usuarios = await prisma.usuario.findMany({
      orderBy: { login: 'asc' },
      select: { login: true, nome: true, perfil: true },
    })
    return { senha: 'demo', usuarios }
  })
}
