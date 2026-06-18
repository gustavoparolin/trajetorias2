import { describe, it, expect, afterAll, beforeEach, vi } from 'vitest'
import bcrypt from 'bcryptjs'

// Prisma mockado — os testes não tocam o banco.
vi.mock('../prisma', () => ({
  prisma: {
    usuario: { findUnique: vi.fn(), findMany: vi.fn() },
    trajetoria: { findMany: vi.fn() },
  },
}))

import { prisma } from '../prisma'
import { construirApp } from '../app'

const hashDemo = bcrypt.hashSync('demo', 10)
const usuarioA = {
  id: 1,
  login: 'usuario.a',
  senhaHash: hashDemo,
  nome: 'Servidor A',
  perfil: 'USUARIO',
  chefeId: null,
}

const app = construirApp()

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(async () => {
  await app.close()
})

describe('POST /login', () => {
  it('autentica com credenciais válidas e retorna token', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(usuarioA as never)
    const res = await app.inject({ method: 'POST', url: '/login', payload: { login: 'usuario.a', senha: 'demo' } })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.token).toBeTruthy()
    expect(body.usuario).toMatchObject({ login: 'usuario.a', perfil: 'USUARIO' })
  })

  it('rejeita senha errada com 401 genérico', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(usuarioA as never)
    const res = await app.inject({ method: 'POST', url: '/login', payload: { login: 'usuario.a', senha: 'errada' } })
    expect(res.statusCode).toBe(401)
    expect(res.json().erro).toBe('Usuário ou senha inválidos.')
  })

  it('rejeita usuário inexistente com a mesma mensagem genérica', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(null as never)
    const res = await app.inject({ method: 'POST', url: '/login', payload: { login: 'naoexiste', senha: 'demo' } })
    expect(res.statusCode).toBe(401)
    expect(res.json().erro).toBe('Usuário ou senha inválidos.')
  })

  it('valida campos em branco com 400', async () => {
    const res = await app.inject({ method: 'POST', url: '/login', payload: { login: '', senha: '' } })
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /eu', () => {
  it('retorna 401 sem token', async () => {
    const res = await app.inject({ method: 'GET', url: '/eu' })
    expect(res.statusCode).toBe(401)
  })

  it('retorna o usuário autenticado com token válido', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(usuarioA as never)
    const login = await app.inject({ method: 'POST', url: '/login', payload: { login: 'usuario.a', senha: 'demo' } })
    const { token } = login.json()
    const res = await app.inject({ method: 'GET', url: '/eu', headers: { authorization: `Bearer ${token}` } })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ login: 'usuario.a', nome: 'Servidor A', perfil: 'USUARIO' })
  })
})

describe('GET /usuarios-demo', () => {
  it('lista usuários quando DEMO_MODE=true', async () => {
    process.env.DEMO_MODE = 'true'
    vi.mocked(prisma.usuario.findMany).mockResolvedValue([
      { login: 'usuario.a', nome: 'Servidor A', perfil: 'USUARIO' },
    ] as never)
    const res = await app.inject({ method: 'GET', url: '/usuarios-demo' })
    expect(res.statusCode).toBe(200)
    expect(res.json().senha).toBe('demo')
    expect(res.json().usuarios).toHaveLength(1)
  })

  it('retorna 404 quando DEMO_MODE não está ativo', async () => {
    process.env.DEMO_MODE = 'false'
    const res = await app.inject({ method: 'GET', url: '/usuarios-demo' })
    expect(res.statusCode).toBe(404)
  })
})
