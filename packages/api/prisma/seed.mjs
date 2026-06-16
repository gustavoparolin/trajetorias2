import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const trajetorias = [
  { cod: 1,  nome: 'CONTROLE DE POLÍTICAS PÚBLICAS', sigla: 'TCPP', sePublicadaSite: true,  dthoraIniVigencia: new Date('2021-08-06') },
  { cod: 3,  nome: 'REGULAÇÃO E DESESTATIZAÇÃO',     sigla: 'TRED', sePublicadaSite: true,  dthoraIniVigencia: new Date('2021-08-06') },
  { cod: 4,  nome: 'AUDITORIA',                       sigla: 'TADT', sePublicadaSite: true,  dthoraIniVigencia: new Date('2021-04-08') },
  { cod: 9,  nome: 'COMBATE A FRAUDE E CORRUPÇÃO',   sigla: 'TCFC', sePublicadaSite: true,  dthoraIniVigencia: new Date('2021-08-10') },
  { cod: 10, nome: 'ANÁLISE DE DADOS',                sigla: 'TADD', sePublicadaSite: true,  dthoraIniVigencia: new Date('2021-08-11') },
  { cod: 11, nome: 'AUDITORIA FINANCEIRA',            sigla: 'TAFN', sePublicadaSite: true,  dthoraIniVigencia: new Date('2021-12-03') },
  { cod: 12, nome: 'LIDERANÇA E GESTÃO',              sigla: 'TLID', sePublicadaSite: true,  dthoraIniVigencia: new Date('2024-03-18') },
  { cod: 13, nome: 'FUNÇÃO JURISDICIONAL',            sigla: 'TFUJ', sePublicadaSite: false, dthoraIniVigencia: new Date('2023-02-06') },
  { cod: 14, nome: 'DESENVOLVIMENTO DE SISTEMAS',     sigla: 'TDTI', sePublicadaSite: false, dthoraIniVigencia: new Date('2023-01-17') },
]

const niveis = [
  // Trajetória 1 — Controle de Políticas Públicas
  { cod: 2, codTrajetoria: 1, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2021-03-12'),
    descr: `<p style="text-align:justify">No&nbsp;n&iacute;vel 1 o auditor dever&aacute; ser capaz de avaliar a formula&ccedil;&atilde;o de pol&iacute;ticas p&uacute;blicas e analisar as alternativas de interven&ccedil;&atilde;o governamental em problemas p&uacute;blicos e o seu processo de tomada de decis&atilde;o; bem como ter no&ccedil;&otilde;es de como avaliar a governan&ccedil;a e gest&atilde;o de pol&iacute;ticas p&uacute;blicas, avaliar os instrumentos de financiamento da pol&iacute;tica p&uacute;blica, avaliar a opera&ccedil;&atilde;o e o desempenho operacional de pol&iacute;ticas p&uacute;blicas, e avaliar o resultado e impactos da pol&iacute;tica p&uacute;blica.</p>` },
  { cod: 4, codTrajetoria: 1, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2021-03-12'),
    descr: `<p style="text-align:justify">No n&iacute;vel 2 o auditor dever&aacute; ser capaz de avaliar a formula&ccedil;&atilde;o de pol&iacute;ticas p&uacute;blicas, analisar as alternativas de interven&ccedil;&atilde;o governamental em problemas p&uacute;blicos e o seu processo de tomada de decis&atilde;o, avaliar a governan&ccedil;a e gest&atilde;o de pol&iacute;ticas p&uacute;blicas e avaliar os instrumentos de financiamento da pol&iacute;tica p&uacute;blica; bem como ter no&ccedil;&otilde;es de como avaliar a opera&ccedil;&atilde;o e o desempenho operacional de pol&iacute;ticas p&uacute;blicas, e avaliar o resultado e impactos da pol&iacute;tica p&uacute;blica.</p>` },
  { cod: 5, codTrajetoria: 1, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2021-03-12'),
    descr: `<p style="text-align:justify">No n&iacute;vel 3 o auditor dever&aacute; ser capaz de avaliar a formula&ccedil;&atilde;o de pol&iacute;ticas p&uacute;blicas, analisar as alternativas de interven&ccedil;&atilde;o governamental em problemas p&uacute;blicos e o seu processo de tomada de decis&atilde;o, avaliar a governan&ccedil;a e gest&atilde;o de pol&iacute;ticas p&uacute;blicas e avaliar os instrumentos de financiamento da pol&iacute;tica p&uacute;blica, avaliar a opera&ccedil;&atilde;o e o desempenho operacional de pol&iacute;ticas p&uacute;blicas, avaliar o resultado e impactos da pol&iacute;tica p&uacute;blica, bem como ter no&ccedil;&otilde;es de como construir a estrat&eacute;gia global de controle de pol&iacute;ticas p&uacute;blicas.</p>` },

  // Trajetória 3 — Regulação e Desestatização
  { cod: 9,  codTrajetoria: 3, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2021-08-06'),
    descr: `<p><strong>O auditor, ao completar o&nbsp;n&iacute;vel 1, dever&aacute; ser capaz de exibir desempenho satisfat&oacute;rio ao lidar com situa&ccedil;&otilde;es usuais e espec&iacute;ficas em fiscaliza&ccedil;&otilde;es de desestatiza&ccedil;&atilde;o e de regula&ccedil;&atilde;o, reunindo condi&ccedil;&otilde;es para atuar em tarefas que n&atilde;o exigem um conhecimento mais complexo e necessitando de orienta&ccedil;&atilde;o para exercer seu trabalho sob a supervis&atilde;o de profissionais mais experientes.</strong></p>` },
  { cod: 10, codTrajetoria: 3, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2021-08-06'),
    descr: `<p><strong>O auditor, ao completar o n&iacute;vel 2 da trajet&oacute;ria, dever&aacute; ser capaz de exibir desempenho superior ao lidar com situa&ccedil;&otilde;es usuais e espec&iacute;ficas em fiscaliza&ccedil;&otilde;es de desestatiza&ccedil;&atilde;o e de regula&ccedil;&atilde;o e desempenho satisfat&oacute;rio ao enfrentar situa&ccedil;&otilde;es complexas, reunindo condi&ccedil;&otilde;es tanto para atuar com maior autonomia quanto para coordenar equipes, por&eacute;m com poder de decis&atilde;o limitado, apoiando e cooperando com profissionais mais experientes.</strong></p>` },
  { cod: 11, codTrajetoria: 3, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2021-08-06'),
    descr: `<p><strong>O auditor, ao completar o n&iacute;vel 3 da trajet&oacute;ria, dever&aacute; ser capaz de exibir desempenho superior ao lidar com situa&ccedil;&otilde;es usuais, espec&iacute;ficas ou complexas enfrentadas em fiscaliza&ccedil;&otilde;es de desestatiza&ccedil;&atilde;o e de regula&ccedil;&atilde;o, reunindo condi&ccedil;&otilde;es tanto para atuar em todas as tarefas com autonomia na tomada de decis&atilde;o quanto para supervisionar equipes a partir de sua lideran&ccedil;a, contribuindo para o desenvolvimento dos profissionais com menos experi&ecirc;ncia.</strong></p>` },

  // Trajetória 4 — Auditoria
  { cod: 6, codTrajetoria: 4, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2021-04-08'),
    descr: `<p>O auditor, ao completar este n&iacute;vel,&nbsp;dever&aacute;&nbsp;ser capaz de&nbsp;exibir desempenho&nbsp;satisfat&oacute;rio&nbsp;ao lidar&nbsp;com&nbsp;situa&ccedil;&otilde;es usuais&nbsp;de&nbsp;uma&nbsp;auditoria, reunindo&nbsp;condi&ccedil;&otilde;es&nbsp;para&nbsp;atuar como um membro de equipe que coopera para o alcance dos objetivos da auditoria sob a supervis&atilde;o de profissionais mais experientes.</p>` },
  { cod: 7, codTrajetoria: 4, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2021-04-08'),
    descr: `<p>O auditor, ao completar este n&iacute;vel, dever&aacute; ser capaz de exibir desempenho superior ao lidar com situa&ccedil;&otilde;es usuais de uma auditoria e desempenho satisfat&oacute;rio ao enfrentar situa&ccedil;&otilde;es complexas, reunindo condi&ccedil;&otilde;es tanto para atuar com maior autonomia como um membro de equipe que coopera para o alcance dos objetivos da auditoria&nbsp;quanto para coordenar equipes de auditoria com desenvoltura&nbsp;e assegurar o atendimento &agrave;s normas e padr&otilde;es aplic&aacute;veis.</p>` },
  { cod: 8, codTrajetoria: 4, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2021-04-08'),
    descr: `<p>O auditor, ao completar o n&iacute;vel 3 da trajet&oacute;ria, dever&aacute; ser capaz de exibir desempenho superior&nbsp;em&nbsp;situa&ccedil;&otilde;es&nbsp;usuais ou complexas enfrentadas em&nbsp;uma auditoria,&nbsp;reunindo condi&ccedil;&otilde;es&nbsp;para&nbsp;supervisionar equipes de auditoria de forma a alcan&ccedil;ar os objetivos da auditoria, assegurar o atendimento &agrave;s normas e padr&otilde;es aplic&aacute;veis, e contribuir para o desenvolvimento da equipe. Reconhecido como especialista em auditoria,&nbsp;ser&aacute;&nbsp;capaz de produzir conhecimento relevante para o desenvolvimento da auditoria no TCU e para a tomada de decis&atilde;o estrat&eacute;gica.</p>` },

  // Trajetória 9 — Combate a Fraude e Corrupção
  { cod: 13, codTrajetoria: 9, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2021-08-10'),
    descr: `<p>O auditor N&iacute;vel 1 da trajet&oacute;ria em combate a fraude e corrup&ccedil;&atilde;o dever&aacute; ter conhecimento dos fundamentos de combate &agrave; fraude e corrup&ccedil;&atilde;o, notadamente, conceitua&ccedil;&atilde;o, causas, tipologias e t&eacute;cnicas empregadas para prevenir e combat&ecirc;-las. Nesta etapa, os conhecimentos ser&atilde;o aplicados na fase de planejamento, elabora&ccedil;&atilde;o de pap&eacute;is de trabalho e plano de auditoria, bem como na identifica&ccedil;&atilde;o de situa&ccedil;&otilde;es suscept&iacute;veis a riscos de fraude e corrup&ccedil;&atilde;o.</p>` },
  { cod: 14, codTrajetoria: 9, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2021-08-10'),
    descr: `<p>O auditor N&iacute;vel 2 da trajet&oacute;ria em combate a fraude e corrup&ccedil;&atilde;o deve possuir todas as compet&ecirc;ncias necess&aacute;rias para executar auditorias que tenham como objeto tema fraude e corrup&ccedil;&atilde;o. O auditor dever&aacute;, dentre outras habilidades, atuar na fase de execu&ccedil;&atilde;o, coletar de provas, aplicar t&eacute;cnicas para exame do objeto auditado, avaliar eventuais danos causados, propor san&ccedil;&otilde;es, assim como produzir relat&oacute;rio ou documento cong&ecirc;nere acerca do trabalho elaborado.</p>` },
  { cod: 15, codTrajetoria: 9, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2021-08-10'),
    descr: `<p>O auditor de N&iacute;vel 3 da trajet&oacute;ria em combate a fraude e corrup&ccedil;&atilde;o deve ser capaz de atuar em trabalhos mais complexos, supervisionar auditorias, atuar na produ&ccedil;&atilde;o de conhecimento, elabora&ccedil;&atilde;o de material bibliogr&aacute;fico e/ou t&eacute;cnicos, tais como: atos normativos, delibera&ccedil;&otilde;es, apresenta&ccedil;&otilde;es etc., participa&ccedil;&atilde;o em grupos de trabalho e difus&atilde;o do conhecimento sobre a tem&aacute;tica.</p>` },

  // Trajetória 10 — Análise de Dados
  { cod: 16, codTrajetoria: 10, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2021-08-11'),
    descr: `<p>O servidor, ao completar este n&iacute;vel, dever&aacute; ser capaz de exibir desempenho satisfat&oacute;rio ao lidar com situa&ccedil;&otilde;es usuais de auditoria ou tratamento de dados, reunindo condi&ccedil;&otilde;es para atuar como membro de equipe que coopera para o alcance dos objetivos da auditoria de dados sob a supervis&atilde;o de profissionais mais experientes.</p>` },
  { cod: 17, codTrajetoria: 10, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2021-08-11'),
    descr: `<p>O servidor, ao completar este n&iacute;vel, dever&aacute; ser capaz de exibir desempenho superior ao lidar com situa&ccedil;&otilde;es usuais de auditoria ou tratamento de dados e desempenho satisfat&oacute;rio ao enfrentar situa&ccedil;&otilde;es complexas, reunindo condi&ccedil;&otilde;es tanto para atuar com autonomia como membro de equipe que coopera para o alcance dos objetivos da auditoria quanto para coordenar equipes de auditoria com desenvoltura e assegurar o atendimento &agrave;s normas e padr&otilde;es aplic&aacute;veis.</p>` },
  { cod: 18, codTrajetoria: 10, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2021-08-11'),
    descr: `<p>O servidor, ao completar este n&iacute;vel, dever&aacute; ser capaz de exibir desempenho superior em situa&ccedil;&otilde;es complexas enfrentadas no tratamento de dados voltado para o controle, reunindo condi&ccedil;&otilde;es para implementar o estado de arte de an&aacute;lise de dados, de forma a poder compor equipes de auditoria na condi&ccedil;&atilde;o de membro especialista ou supervisor e contribuir para o desenvolvimento da equipe.</p>` },

  // Trajetória 11 — Auditoria Financeira
  { cod: 19, codTrajetoria: 11, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2022-01-18'),
    descr: `<p>O auditor que alcan&ccedil;ar o n&iacute;vel 1 da trajet&oacute;ria &eacute; capaz de executar, sob orienta&ccedil;&atilde;o, procedimentos simples ou tarefas de m&eacute;dia complexidade em &aacute;rea(s) espec&iacute;fica(s) que n&atilde;o exigem elevado conhecimento das normas e pr&aacute;ticas de contabilidade p&uacute;blica e auditoria financeira do setor p&uacute;blico.</p>` },
  { cod: 20, codTrajetoria: 11, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2022-01-18'),
    descr: `<p>O auditor que alcan&ccedil;ar o n&iacute;vel 2 da trajet&oacute;ria &eacute; capaz de desenvolver atividades que exigem elevado conhecimento das normas e pr&aacute;ticas de contabilidade p&uacute;blica e auditoria financeira do setor p&uacute;blico, conseguindo coordenar equipes e tomar decis&otilde;es de auditoria endossadas pelos respons&aacute;veis pela dire&ccedil;&atilde;o do trabalho.</p>` },
  { cod: 21, codTrajetoria: 11, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2022-01-18'),
    descr: `<p>O auditor que alcan&ccedil;ar o n&iacute;vel 3 da trajet&oacute;ria &eacute; capaz de agir com base em experi&ecirc;ncias e profundo conhecimento das normas e pr&aacute;ticas de contabilidade p&uacute;blica e auditoria financeira do setor p&uacute;blico adquiridos ao longo da carreira, podendo supervisionar equipes e tomar decis&otilde;es de auditoria com autonomia, formando opini&atilde;o de auditoria.</p>` },

  // Trajetória 12 — Liderança e Gestão
  { cod: 29, codTrajetoria: 12, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2023-07-03'),
    descr: `<p>No n&iacute;vel fundamental, o gestor deve estar apto a lidar satisfatoriamente com situa&ccedil;&otilde;es mais simples da gest&atilde;o, bem como j&aacute; ter iniciado um processo para se autoconhecer e, por consequ&ecirc;ncia, se aprimorar para os n&iacute;veis seguintes da trajet&oacute;ria. &Eacute; tamb&eacute;m um gestor que conhece o b&aacute;sico sobre o gerenciamento de pessoas e equipes, ainda necessita de ajuda para lidar com situa&ccedil;&otilde;es mais desafiadoras e est&aacute; aberto para receber este apoio.</p>` },
  { cod: 30, codTrajetoria: 12, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2023-07-03'),
    descr: `<p>O gestor do n&iacute;vel profissional dever&aacute; ser capaz de demonstrar maior autonomia ao lidar ou solucionar aspectos referentes &agrave; gest&atilde;o, necessitando eventualmente de apoio/aux&iacute;lio nas situa&ccedil;&otilde;es mais complexas. &Eacute; um gestor com vis&atilde;o sist&ecirc;mica sobre a sua atua&ccedil;&atilde;o e sobre a organiza&ccedil;&atilde;o, e consegue intervir nos processos de trabalho e junto aos servidores na busca de aprimoramento.</p>` },
  { cod: 31, codTrajetoria: 12, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2023-07-03'),
    descr: `<p>Espera-se que o gestor do n&iacute;vel especialista seja uma refer&ecirc;ncia em lideran&ccedil;a, sendo reconhecido por outras pessoas e pela institui&ccedil;&atilde;o. &Eacute; um gestor que lida com situa&ccedil;&otilde;es complexas de trabalho, inclusive de crise entre pessoas e &aacute;reas, sabendo agir para o melhor interesse de todos os envolvidos. &Eacute; um l&iacute;der que forma outros l&iacute;deres.</p>` },

  // Trajetória 13 — Função Jurisdicional
  { cod: 22, codTrajetoria: 13, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2022-12-06'),
    descr: `<p>O auditor que alcan&ccedil;ar o n&iacute;vel 1 da trajet&oacute;ria &eacute; capaz de instruir, com moderada autonomia, processos simples ou m&eacute;dia complexidade.</p>` },
  { cod: 23, codTrajetoria: 13, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2022-12-06'),
    descr: `<p>O auditor que alcan&ccedil;ar o n&iacute;vel 2 da trajet&oacute;ria &eacute; capaz de instruir, com grande autonomia, processos de m&eacute;dia a alta complexidade.</p>` },
  { cod: 24, codTrajetoria: 13, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2022-12-06'),
    descr: `<p>O auditor que alcan&ccedil;ar o n&iacute;vel 3 da trajet&oacute;ria &eacute; capaz de instruir, e revisar, com autonomia, processos de m&eacute;dia a alta complexidade, sendo capaz de disseminar seu conhecimento com outros colegas ou com o TCU em geral.</p>` },

  // Trajetória 14 — Desenvolvimento de Sistemas
  { cod: 25, codTrajetoria: 14, indNivelTrajetoria: 1, dthoraIniVigencia: new Date('2022-12-13'),
    descr: `<p>Espera-se que o servidor neste n&iacute;vel seja capaz de discutir os requisitos funcionais de uma aplica&ccedil;&atilde;o, definir o modelo de dados e implementar a respectiva estrutura de armazenamento, criar e testar o c&oacute;digo de toda ou parte da aplica&ccedil;&atilde;o usando uma das plataformas de desenvolvimento usadas pelo TCU e seguindo as boas pr&aacute;ticas de aplica&ccedil;&otilde;es seguras, bem como definir os procedimentos para o <em>deployment</em> da aplica&ccedil;&atilde;o em que estiver trabalhando.</p>` },
  { cod: 27, codTrajetoria: 14, indNivelTrajetoria: 2, dthoraIniVigencia: new Date('2022-12-13'),
    descr: `<p>O servidor do n&iacute;vel profissional deve estar apto a especificar os requisitos funcionais e de atributos de qualidade (performance, escalabilidade, seguran&ccedil;a, usabilidade, etc.) para uma aplica&ccedil;&atilde;o, discutir com seus pares a arquitetura de software adequada para a solu&ccedil;&atilde;o conhecendo os conceitos b&aacute;sicos de arquitetura e os principais design <em>patterns</em> usados em solu&ccedil;&otilde;es semelhantes no TCU, criar e testar o c&oacute;digo de toda ou parte da aplica&ccedil;&atilde;o e usar as ferramentas dispon&iacute;veis para monitorar e identificar problemas no funcionamento das aplica&ccedil;&otilde;es.</p>` },
  { cod: 28, codTrajetoria: 14, indNivelTrajetoria: 3, dthoraIniVigencia: new Date('2022-12-13'),
    descr: `<p>Espera-se que o servidor do n&iacute;vel especialista seja capaz de especificar requisitos funcionais e de atributos de qualidade para uma aplica&ccedil;&atilde;o, definir e comunicar a seus pares a arquitetura de software usando os princ&iacute;pios de design e <em>patterns</em> aplic&aacute;veis, criar e testar o c&oacute;digo seguindo as boas pr&aacute;ticas de aplica&ccedil;&otilde;es seguras, revisar o c&oacute;digo fonte e demais artefatos criados por membros da equipe, bem como definir e conduzir os procedimentos de acompanhamento de um projeto de desenvolvimento de software.</p>` },
]

async function main() {
  console.log('🌱 Seed: importando trajetórias e níveis...')

  for (const t of trajetorias) {
    await prisma.trajetoria.upsert({
      where: { cod: t.cod },
      update: t,
      create: t,
    })
  }
  console.log(`   ✅ ${trajetorias.length} trajetórias`)

  for (const n of niveis) {
    await prisma.trajetoriaNivel.upsert({
      where: { cod: n.cod },
      update: n,
      create: n,
    })
  }
  console.log(`   ✅ ${niveis.length} níveis`)

  console.log('🌱 Seed concluído.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
