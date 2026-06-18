/**
 * Seed dos usuários demo (login + perfil + hierarquia).
 * Senha única `demo` para todos (modo demonstração), guardada como hash bcrypt.
 * Idempotente (upsert por login). Roda no startup em produção.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const senhaHash = bcrypt.hashSync('demo', 10)

// Ordem importa: chefes antes de subordinados (FK chefeId).
const usuarios = [
  { login: 'gestor.d',  nome: 'Gestor D', perfil: 'GESTOR',  chefe: null },
  { login: 'gestor.e',  nome: 'Gestor E', perfil: 'GESTOR',  chefe: null },
  { login: 'admin.isc', nome: 'Admin ISC', perfil: 'ADMIN',  chefe: null },
  { login: 'usuario.a', nome: 'Servidor A', perfil: 'USUARIO', chefe: 'gestor.d' },
  { login: 'usuario.b', nome: 'Servidor B', perfil: 'USUARIO', chefe: 'usuario.a' },
  { login: 'usuario.c', nome: 'Servidor C', perfil: 'USUARIO', chefe: 'usuario.a' },
]

async function main() {
  console.log('🌱 Seed: usuários demo...')
  const idPorLogin = new Map()

  for (const u of usuarios) {
    const chefeId = u.chefe ? idPorLogin.get(u.chefe) ?? null : null
    const dados = { senhaHash, nome: u.nome, perfil: u.perfil, chefeId }
    const salvo = await prisma.usuario.upsert({
      where: { login: u.login },
      update: dados,
      create: { login: u.login, ...dados },
    })
    idPorLogin.set(u.login, salvo.id)
  }
  console.log(`   ✅ ${usuarios.length} usuários demo (senha: demo)`)
}

main()
  .catch((e) => { console.error('❌ Seed usuários:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
