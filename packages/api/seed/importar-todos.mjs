/**
 * Importa todos os CSVs exportados do Oracle para o PostgreSQL.
 *
 * Uso:
 *   node packages/api/seed/importar-todos.mjs
 *
 * No Docker (VPS):
 *   docker exec -e CSV_DIR=/tmp/csvs <container> node /app/seed/importar-todos.mjs
 */

import { readFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { PrismaClient } from '@prisma/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_DIR = process.env.CSV_DIR
  ? resolve(process.env.CSV_DIR)
  : resolve(__dirname, '../../../seed/oracle-exports')

const prisma = new PrismaClient()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerCsv(nomeArquivo) {
  const caminho = join(CSV_DIR, nomeArquivo)
  const conteudo = readFileSync(caminho, 'latin1')
  return parse(conteudo, {
    delimiter: ';',
    columns: true,
    quote: '"',
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  })
}

const toInt      = (v) => v && String(v).trim() ? parseInt(v) : null
const toIntReq   = (v) => parseInt(v)
const toDate     = (v) => v && String(v).trim() ? new Date(v) : null
const toStr      = (v) => v && String(v).trim() ? String(v).trim() : null
const toBool     = (v) => v === 'S' || v === 'true' || v === '1'
const toBoolOpt  = (v) => v && String(v).trim() ? toBool(v) : false

function em(n, total) {
  const pct = Math.round(n / total * 100)
  process.stdout.write(`\r   ${n}/${total} (${pct}%)`)
}

// ─── Importações ─────────────────────────────────────────────────────────────

async function importarTrajetorias() {
  console.log('\n📂 Q01 — Trajetórias')
  const rows = lerCsv('q01_trajetorias.csv')
  await prisma.trajetoria.createMany({
    data: rows.map(r => ({
      cod:               toIntReq(r.COD),
      nome:              r.NOME.trim(),
      sigla:             r.SIGLA.trim(),
      sePublicadaSite:   r.SE_PUBLICADA_SITE === 'S',
      dthoraIniVigencia: new Date(r.DTHORA_INI_VIGENCIA),
      dthoraFimVigencia: toDate(r.DTHORA_FIM_VIGENCIA),
    })),
    skipDuplicates: true,
  })
  console.log(`   ✅ ${rows.length} trajetórias`)
}

async function importarNiveis() {
  console.log('\n📂 Q02 — Níveis')
  const rows = lerCsv('q02_niveis.csv')
  await prisma.trajetoriaNivel.createMany({
    data: rows.map(r => ({
      cod:               toIntReq(r.COD),
      codTrajetoria:     toIntReq(r.COD_TRAJETORIA),
      indNivelTrajetoria: toIntReq(r.IND_NIVEL_TRAJETORIA),
      descr:             r.DESCR ?? '',
      dthoraIniVigencia: new Date(r.DTHORA_INI_VIGENCIA),
      dthoraFimVigencia: toDate(r.DTHORA_FIM_VIGENCIA),
    })),
    skipDuplicates: true,
  })
  console.log(`   ✅ ${rows.length} níveis`)
}

async function importarCompetencias() {
  console.log('\n📂 Q03 — Competências (217 registros)')
  const rows = lerCsv('q03_competencias.csv')
  const LOTE = 50
  let total = 0
  for (let i = 0; i < rows.length; i += LOTE) {
    const lote = rows.slice(i, i + LOTE)
    await prisma.competencia.createMany({
      data: lote.map(r => ({
        cod:               toIntReq(r.COD),
        indClassificacao:  toStr(r.IND_CLASSIFICACAO),
        nome:              r.NOME.trim(),
        descr:             toStr(r.DESCR),
        sigla:             toStr(r.SIGLA),
        seqApresentacao:   toInt(r.SEQ_APRESENTACAO),
        dthoraIniVigencia: new Date(r.DTHORA_INI_VIGENCIA),
        dthoraFimVigencia: toDate(r.DTHORA_FIM_VIGENCIA),
      })),
      skipDuplicates: true,
    })
    total += lote.length
    em(total, rows.length)
  }
  console.log(`\n   ✅ ${rows.length} competências`)
}

async function importarComportamentos() {
  console.log('\n📂 Q04 — Comportamentos (1.197 registros)')
  const rows = lerCsv('q04_comportamentos.csv')
  const LOTE = 100
  let total = 0
  for (let i = 0; i < rows.length; i += LOTE) {
    const lote = rows.slice(i, i + LOTE)
    await prisma.comportamento.createMany({
      data: lote.map(r => ({
        cod:               toIntReq(r.COD),
        codCompetencia:    toIntReq(r.COD_COMPETENCIA),
        nome:              r.NOME.trim(),
        descr:             toStr(r.DESCR),
        sigla:             toStr(r.SIGLA),
        seqApresentacao:   toInt(r.SEQ_APRESENTACAO),
        dthoraIniVigencia: new Date(r.DTHORA_INI_VIGENCIA),
        dthoraFimVigencia: toDate(r.DTHORA_FIM_VIGENCIA),
      })),
      skipDuplicates: true,
    })
    total += lote.length
    em(total, rows.length)
  }
  console.log(`\n   ✅ ${rows.length} comportamentos`)
}

async function importarTrajetoriaCompetencia() {
  console.log('\n📂 Q05 — Trajetória × Competência')
  const rows = lerCsv('q05_trajetoria_competencia.csv')
  await prisma.trajetoriaCompetencia.createMany({
    data: rows.map(r => ({
      cod:               toIntReq(r.COD),
      codTrajetoria:     toIntReq(r.COD_TRAJETORIA),
      codCompetencia:    toIntReq(r.COD_COMPETENCIA),
      seqApresentacao:   toInt(r.SEQ_APRESENTACAO),
      dthoraIniVigencia: new Date(r.DTHORA_INI_VIGENCIA),
      dthoraFimVigencia: toDate(r.DTHORA_FIM_VIGENCIA),
    })),
    skipDuplicates: true,
  })
  console.log(`   ✅ ${rows.length} vínculos`)
}

async function importarEspacos() {
  console.log('\n📂 Q06 — Espaços Ocupacionais')
  const rows = lerCsv('q06_espacos.csv')

  const espacosMap = new Map()
  for (const r of rows) {
    const cod = toIntReq(r.COD_ESPACO)
    if (!espacosMap.has(cod)) espacosMap.set(cod, r.NOME_ESPACO.trim())
  }

  await prisma.espacoOcupacional.createMany({
    data: Array.from(espacosMap.entries()).map(([cod, nome]) => ({ cod, nome })),
    skipDuplicates: true,
  })

  await prisma.trajetoriaEspaco.createMany({
    data: rows.map(r => ({
      codEspaco:     toIntReq(r.COD_ESPACO),
      codTrajetoria: toIntReq(r.COD_TRAJETORIA),
    })),
    skipDuplicates: true,
  })
  console.log(`   ✅ ${espacosMap.size} espaços, ${rows.length} vínculos`)
}

async function importarPessoas() {
  console.log('\n📂 Q08 — Pessoas + Adesões')
  const rows = lerCsv('q08_adesoes.csv')

  // Derivar pessoas únicas das adesões
  const pessoasMap = new Map()
  for (const r of rows) {
    const cod = toIntReq(r.COD_PESSOA_FISICA)
    if (!pessoasMap.has(cod)) {
      pessoasMap.set(cod, { codPessoaFisica: cod, nomeAnonimizado: `Servidor ${cod}` })
    }
  }

  await prisma.pessoa.createMany({
    data: Array.from(pessoasMap.values()),
    skipDuplicates: true,
  })

  await prisma.pessoaTrajetoria.createMany({
    data: rows.map(r => ({
      cod:             toIntReq(r.COD),
      codPessoaFisica: toIntReq(r.COD_PESSOA_FISICA),
      codTrajetoria:   toIntReq(r.COD_TRAJETORIA),
      dataAdesao:      toDate(r.DATA_ADESAO),
    })),
    skipDuplicates: true,
  })
  console.log(`   ✅ ${pessoasMap.size} pessoas, ${rows.length} adesões`)
}

async function importarNiveisPessoa() {
  console.log('\n📂 Q09 — Níveis por pessoa')
  const rows = lerCsv('q09_niveis_pessoa.csv')
  await prisma.pessoaTrajetoriaNivel.createMany({
    data: rows.map(r => ({
      cod:                 toIntReq(r.COD),
      codPessoaTrajetoria: toIntReq(r.COD_PESSOA_TRAJETORIA),
      codTrajetoriaNivel:  toIntReq(r.COD_TRAJETORIA_NIVEL),
      seHabilitado:        toBoolOpt(r.SE_HABILITADO),
      dataSolicitacao:     toDate(r.DATA_SOLICITACAO),
      dataAvaliacao:       toDate(r.DATA_AVALIACAO),
    })),
    skipDuplicates: true,
  })
  console.log(`   ✅ ${rows.length} registros`)
}

async function importarAutoavaliacoes() {
  console.log('\n📂 Q10 — Autoavaliações (2.058 registros)')
  const rows = lerCsv('q10_autoavaliacoes.csv')
  const LOTE = 200
  let total = 0
  for (let i = 0; i < rows.length; i += LOTE) {
    const lote = rows.slice(i, i + LOTE)
    await prisma.pessoaAutoavaliacao.createMany({
      data: lote.map(r => ({
        cod:             toIntReq(r.COD),
        codPessoaFisica: toIntReq(r.COD_PESSOA_FISICA),
        codComportamento: toIntReq(r.COD_COMPORTAMENTO),
        grau:            toIntReq(r.GRAU),
        seHomologado:    toBoolOpt(r.SE_HOMOLOGADO),
        dataAvaliacao:   toDate(r.DATA_AVALIACAO),
      })),
      skipDuplicates: true,
    })
    total += lote.length
    em(total, rows.length)
  }
  console.log(`\n   ✅ ${rows.length} autoavaliações`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Importação Oracle → PostgreSQL')
  console.log(`   CSV_DIR: ${CSV_DIR}`)

  await importarTrajetorias()
  await importarNiveis()
  await importarCompetencias()
  await importarComportamentos()
  await importarTrajetoriaCompetencia()
  await importarEspacos()
  await importarPessoas()
  await importarNiveisPessoa()
  await importarAutoavaliacoes()

  console.log('\n✅ Importação concluída!')

  // Totais finais
  const [trj, niv, comp, comp2, pes, ades, aval] = await Promise.all([
    prisma.trajetoria.count(),
    prisma.trajetoriaNivel.count(),
    prisma.competencia.count(),
    prisma.comportamento.count(),
    prisma.pessoa.count(),
    prisma.pessoaTrajetoria.count(),
    prisma.pessoaAutoavaliacao.count(),
  ])
  console.log(`\n📊 Banco de dados:`)
  console.log(`   trajetoria:          ${trj}`)
  console.log(`   trajetoria_nivel:    ${niv}`)
  console.log(`   competencia:         ${comp}`)
  console.log(`   comportamento:       ${comp2}`)
  console.log(`   pessoa:              ${pes}`)
  console.log(`   pessoa_trajetoria:   ${ades}`)
  console.log(`   pessoa_autoavaliacao: ${aval}`)
}

main()
  .catch(e => { console.error('\n❌ Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
