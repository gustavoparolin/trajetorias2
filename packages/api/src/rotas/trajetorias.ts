import type { FastifyInstance } from 'fastify'
import { prisma } from '../prisma'

/** Rotas de consulta de trajetórias e seus níveis. */
export async function rotasTrajetorias(app: FastifyInstance) {
  app.get('/trajetorias', async () => {
    const trajetorias = await prisma.trajetoria.findMany({
      orderBy: { cod: 'asc' },
      include: { niveis: { orderBy: { indNivelTrajetoria: 'asc' } } },
    })
    return { total: trajetorias.length, trajetorias }
  })
}
