import { createServer } from 'node:http'
import { PrismaClient } from '@prisma/client'

const PORT = process.env.PORT ?? 3001
const prisma = new PrismaClient()

const app = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const key = `${req.method} ${url.pathname}`

  const origin = req.headers.origin ?? ''
  const allowed = (process.env.FRONTEND_ORIGINS ?? '').split(',')
  if (allowed.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  const json = (data, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }

  try {
    if (key === 'GET /health') {
      return json({ status: 'ok', service: 'trajetorias2-api', version: '0.1.0', env: process.env.NODE_ENV ?? 'development', timestamp: new Date().toISOString() })
    }

    if (key === 'GET /') {
      return json({ name: 'Trajetórias 2.0 API', docs: 'https://github.com/gustavoparolin/trajetorias2', status: 'em construção — MVP Sprint 1' })
    }

    if (key === 'GET /trajetorias') {
      const trajetorias = await prisma.trajetoria.findMany({
        orderBy: { cod: 'asc' },
        include: { niveis: { orderBy: { indNivelTrajetoria: 'asc' } } },
      })
      return json({ total: trajetorias.length, trajetorias })
    }

    return json({ error: 'Rota não encontrada', path: req.url }, 404)
  } catch (err) {
    console.error(err)
    return json({ error: 'Erro interno do servidor' }, 500)
  }
})

app.listen(PORT, () => {
  console.log(`✅ trajetorias2-api rodando na porta ${PORT}`)
  console.log(`   NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`)
  console.log(`   DEMO_MODE: ${process.env.DEMO_MODE ?? 'false'}`)
})
