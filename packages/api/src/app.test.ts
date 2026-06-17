import { describe, it, expect, afterAll } from 'vitest'
import { construirApp } from './app'

const app = construirApp()

afterAll(async () => {
  await app.close()
})

describe('rotas de saúde', () => {
  it('GET /health retorna status ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({
      status: 'ok',
      service: 'trajetorias2-api',
    })
  })

  it('GET / retorna o nome da API', async () => {
    const res = await app.inject({ method: 'GET', url: '/' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toHaveProperty('name')
  })

  it('rota inexistente retorna 404', async () => {
    const res = await app.inject({ method: 'GET', url: '/rota-que-nao-existe' })
    expect(res.statusCode).toBe(404)
  })
})
