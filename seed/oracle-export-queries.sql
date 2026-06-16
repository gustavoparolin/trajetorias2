-- =============================================================
-- QUERIES DE EXPORTAÇÃO ORACLE → PostgreSQL
-- Sistema Trajetórias 2.0
-- =============================================================
-- Como usar:
--   1. Abrir APEX SQL Workshop no sistema Trajetórias produção
--   2. Colar cada query (uma de cada vez) e executar
--   3. Clicar em "Download" no resultado (formato CSV)
--   4. Salvar em seed/oracle-exports/<nome>.csv
--   5. NUNCA commitar esses CSVs no repositório
-- =============================================================


-- -------------------------------------------------------------
-- Q01 — Trajetórias
-- Arquivo: seed/oracle-exports/q01_trajetorias.csv
-- -------------------------------------------------------------
SELECT
    COD,
    NOME,
    SIGLA,
    SE_PUBLICADA_SITE,
    TO_CHAR(DTHORA_INI_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_INI_VIGENCIA,
    TO_CHAR(DTHORA_FIM_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_FIM_VIGENCIA
FROM AT_TRAJETORIA
WHERE DTHORA_FIM_VIGENCIA IS NULL
ORDER BY COD;


-- -------------------------------------------------------------
-- Q02 — Níveis das trajetórias
-- Arquivo: seed/oracle-exports/q02_niveis.csv
-- -------------------------------------------------------------
SELECT
    COD,
    COD_TRAJETORIA,
    IND_NIVEL_TRAJETORIA,
    DESCR,
    TO_CHAR(DTHORA_INI_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_INI_VIGENCIA,
    TO_CHAR(DTHORA_FIM_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_FIM_VIGENCIA
FROM AT_TRAJETORIA_NIVEL
WHERE DTHORA_FIM_VIGENCIA IS NULL
ORDER BY COD_TRAJETORIA, IND_NIVEL_TRAJETORIA;


-- -------------------------------------------------------------
-- Q03 — Competências
-- Arquivo: seed/oracle-exports/q03_competencias.csv
-- -------------------------------------------------------------
SELECT
    COD,
    IND_CLASSIFICACAO,
    NOME,
    DESCR,
    SIGLA,
    SEQ_APRESENTACAO,
    TO_CHAR(DTHORA_INI_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_INI_VIGENCIA,
    TO_CHAR(DTHORA_FIM_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_FIM_VIGENCIA
FROM AT_COMPETENCIA
WHERE DTHORA_FIM_VIGENCIA IS NULL
ORDER BY COD;


-- -------------------------------------------------------------
-- Q04 — Comportamentos (chamados "subcompetências" no Oracle)
-- Arquivo: seed/oracle-exports/q04_comportamentos.csv
-- -------------------------------------------------------------
SELECT
    COD,
    COD_COMPETENCIA,
    NOME,
    DESCR,
    SIGLA,
    SEQ_APRESENTACAO,
    TO_CHAR(DTHORA_INI_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_INI_VIGENCIA,
    TO_CHAR(DTHORA_FIM_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_FIM_VIGENCIA
FROM AT_SUBCOMPETENCIA
WHERE DTHORA_FIM_VIGENCIA IS NULL
ORDER BY COD_COMPETENCIA, SEQ_APRESENTACAO, COD;


-- -------------------------------------------------------------
-- Q05 — Trajetória × Competência (quais competências compõem cada trajetória)
-- Arquivo: seed/oracle-exports/q05_trajetoria_competencia.csv
-- -------------------------------------------------------------
SELECT
    TC.COD,
    TC.COD_TRAJETORIA,
    TC.COD_COMPETENCIA,
    TC.SEQ_APRESENTACAO,
    TO_CHAR(TC.DTHORA_INI_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_INI_VIGENCIA,
    TO_CHAR(TC.DTHORA_FIM_VIGENCIA, 'YYYY-MM-DD HH24:MI:SS') AS DTHORA_FIM_VIGENCIA
FROM AT_TRAJETORIA_COMPETENCIA TC
WHERE TC.DTHORA_FIM_VIGENCIA IS NULL
ORDER BY TC.COD_TRAJETORIA, TC.SEQ_APRESENTACAO;


-- -------------------------------------------------------------
-- Q06 — Espaços Ocupacionais e vínculo com trajetórias
-- Arquivo: seed/oracle-exports/q06_espacos.csv
-- -------------------------------------------------------------
SELECT
    EO.COD          AS COD_ESPACO,
    EO.NOME         AS NOME_ESPACO,
    TEO.COD_TRAJETORIA
FROM AT_ESPACO_OCUPACIONAL EO
JOIN AT_TRAJETORIA_ESPACO_OCUP TEO ON TEO.COD_ESPACO_OCUPACIONAL = EO.COD
ORDER BY EO.COD;


-- -------------------------------------------------------------
-- Q07 — Usuários e hierarquia
-- Arquivo: seed/oracle-exports/q07_usuarios.csv
--
-- ATENÇÃO: AT_PESSOA_FISICA vem do schema SIAPE (externo).
-- Se o link de banco não estiver disponível no seu APEX,
-- use apenas AT_USUARIO e preencha o nome manualmente no seed.
--
-- Nome é anonimizado aqui: "Servidor " || PF.COD
-- CPF é OMITIDO propositalmente.
-- -------------------------------------------------------------
SELECT
    U.COD                                   AS COD_USUARIO,
    U.COD_LOGIN,
    U.COD_PERFIL,
    PT.COD_PESSOA_FISICA,
    'Servidor ' || PT.COD_PESSOA_FISICA     AS NOME_ANONIMIZADO
FROM AT_USUARIO U
JOIN (
    -- Pessoas ativas: avaliaram algo nos últimos 2 anos
    SELECT DISTINCT PT2.COD_PESSOA_FISICA
    FROM AT_PESSOA_TRAJETORIA PT2
    JOIN AT_PESSOA_SUBCOMPETENCIA PSC
      ON PSC.COD_PESSOA_FISICA = PT2.COD_PESSOA_FISICA
     AND PSC.DTHORA_FIM_VIGENCIA IS NULL
     AND PSC.DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24)
    WHERE PT2.DTHORA_FIM_VIGENCIA IS NULL
) ATIVOS ON ATIVOS.COD_PESSOA_FISICA = U.COD_USUARIO
WHERE U.COD_APP = 'ATENA'
ORDER BY U.COD_LOGIN;

-- Se BDSIAPE não estiver acessível, use esta versão simplificada:
/*
SELECT
    COD,
    COD_APP,
    COD_LOGIN,
    COD_PERFIL
FROM AT_USUARIO
WHERE COD_APP = 'ATENA'
ORDER BY COD_LOGIN;
*/


-- -------------------------------------------------------------
-- Q08 — Adesões de servidores a trajetórias
-- Arquivo: seed/oracle-exports/q08_adesoes.csv
-- Limitado a 50 servidores ativos com adesões vigentes
-- -------------------------------------------------------------
SELECT
    PT.COD,
    PT.COD_TRAJETORIA,
    PT.COD_PESSOA_FISICA,
    TO_CHAR(PT.DTHORA_INI_VIGENCIA, 'YYYY-MM-DD') AS DATA_ADESAO
FROM AT_PESSOA_TRAJETORIA PT
WHERE PT.DTHORA_FIM_VIGENCIA IS NULL
  AND PT.COD_PESSOA_FISICA IN (
    SELECT DISTINCT PT2.COD_PESSOA_FISICA
    FROM AT_PESSOA_TRAJETORIA PT2
    JOIN AT_PESSOA_SUBCOMPETENCIA PSC
      ON PSC.COD_PESSOA_FISICA = PT2.COD_PESSOA_FISICA
     AND PSC.DTHORA_FIM_VIGENCIA IS NULL
     AND PSC.DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24)
    WHERE PT2.DTHORA_FIM_VIGENCIA IS NULL
  )
ORDER BY PT.COD_PESSOA_FISICA, PT.COD_TRAJETORIA;


-- -------------------------------------------------------------
-- Q09 — Níveis atuais dos servidores (posição no dashboard)
-- Arquivo: seed/oracle-exports/q09_niveis_pessoa.csv
-- -------------------------------------------------------------
SELECT
    PTN.COD,
    PTN.COD_PESSOA_TRAJETORIA,
    PTN.COD_TRAJETORIA_NIVEL,
    PTN.SE_HABILITADO,
    TO_CHAR(PTN.DTHORA_CADASTRO,  'YYYY-MM-DD') AS DATA_SOLICITACAO,
    TO_CHAR(PTN.DTHORA_AVALIACAO, 'YYYY-MM-DD') AS DATA_AVALIACAO
FROM AT_PESSOA_TRAJETORIA_NIVEL PTN
JOIN AT_PESSOA_TRAJETORIA PT ON PT.COD = PTN.COD_PESSOA_TRAJETORIA
WHERE PTN.DTHORA_FIM_VIGENCIA IS NULL
  AND PT.DTHORA_FIM_VIGENCIA  IS NULL
  AND PT.COD_PESSOA_FISICA IN (
    SELECT DISTINCT PT2.COD_PESSOA_FISICA
    FROM AT_PESSOA_TRAJETORIA PT2
    JOIN AT_PESSOA_SUBCOMPETENCIA PSC
      ON PSC.COD_PESSOA_FISICA = PT2.COD_PESSOA_FISICA
     AND PSC.DTHORA_FIM_VIGENCIA IS NULL
     AND PSC.DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24)
    WHERE PT2.DTHORA_FIM_VIGENCIA IS NULL
  )
ORDER BY PTN.COD_PESSOA_TRAJETORIA;


-- -------------------------------------------------------------
-- Q10 — Autoavaliações de comportamentos
-- Arquivo: seed/oracle-exports/q10_autoavaliacoes.csv
-- -------------------------------------------------------------
SELECT
    PSC.COD,
    PSC.COD_PESSOA_FISICA,
    PSC.COD_SUBCOMPETENCIA              AS COD_COMPORTAMENTO,
    PSC.IND_NIVEL_DOMINIO               AS GRAU,
    PSC.SE_HOMOLOGADO,
    TO_CHAR(PSC.DTHORA_CADASTRO,       'YYYY-MM-DD') AS DATA_AVALIACAO
FROM AT_PESSOA_SUBCOMPETENCIA PSC
WHERE PSC.DTHORA_FIM_VIGENCIA IS NULL
  AND PSC.DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24)
  AND PSC.COD_PESSOA_FISICA IN (
    SELECT DISTINCT PT2.COD_PESSOA_FISICA
    FROM AT_PESSOA_TRAJETORIA PT2
    WHERE PT2.DTHORA_FIM_VIGENCIA IS NULL
  )
ORDER BY PSC.COD_PESSOA_FISICA, PSC.COD_SUBCOMPETENCIA;


-- -------------------------------------------------------------
-- Q11 — Verificação: quantos registros cada query exporta
-- Rodar antes para saber o volume
-- -------------------------------------------------------------
SELECT 'AT_TRAJETORIA (vigentes)'          AS TABELA, COUNT(*) AS TOTAL FROM AT_TRAJETORIA          WHERE DTHORA_FIM_VIGENCIA IS NULL UNION ALL
SELECT 'AT_TRAJETORIA_NIVEL (vigentes)',                COUNT(*)         FROM AT_TRAJETORIA_NIVEL      WHERE DTHORA_FIM_VIGENCIA IS NULL UNION ALL
SELECT 'AT_COMPETENCIA (vigentes)',                     COUNT(*)         FROM AT_COMPETENCIA           WHERE DTHORA_FIM_VIGENCIA IS NULL UNION ALL
SELECT 'AT_SUBCOMPETENCIA (vigentes)',                  COUNT(*)         FROM AT_SUBCOMPETENCIA        WHERE DTHORA_FIM_VIGENCIA IS NULL UNION ALL
SELECT 'AT_TRAJETORIA_COMPETENCIA (vigentes)',          COUNT(*)         FROM AT_TRAJETORIA_COMPETENCIA WHERE DTHORA_FIM_VIGENCIA IS NULL UNION ALL
SELECT 'AT_PESSOA_TRAJETORIA (vigentes)',               COUNT(*)         FROM AT_PESSOA_TRAJETORIA     WHERE DTHORA_FIM_VIGENCIA IS NULL UNION ALL
SELECT 'AT_USUARIO (ATENA)',                            COUNT(*)         FROM AT_USUARIO               WHERE COD_APP = 'ATENA'
ORDER BY TABELA;


-- -------------------------------------------------------------
-- VERIFICAÇÃO FINAL — volumes esperados antes de exportar
-- -------------------------------------------------------------
SELECT 'Pessoas ativas (filtro 2 anos)'   AS CONJUNTO, COUNT(DISTINCT PSC.COD_PESSOA_FISICA) AS TOTAL
FROM AT_PESSOA_SUBCOMPETENCIA PSC
WHERE PSC.DTHORA_FIM_VIGENCIA IS NULL
  AND PSC.DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24)
UNION ALL
SELECT 'Adesões vigentes dessas pessoas',  COUNT(*)
FROM AT_PESSOA_TRAJETORIA PT
WHERE PT.DTHORA_FIM_VIGENCIA IS NULL
  AND PT.COD_PESSOA_FISICA IN (
    SELECT DISTINCT COD_PESSOA_FISICA FROM AT_PESSOA_SUBCOMPETENCIA
    WHERE DTHORA_FIM_VIGENCIA IS NULL AND DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24)
  )
UNION ALL
SELECT 'Autoavaliações a exportar',        COUNT(*)
FROM AT_PESSOA_SUBCOMPETENCIA
WHERE DTHORA_FIM_VIGENCIA IS NULL
  AND DTHORA_CADASTRO >= ADD_MONTHS(SYSDATE, -24);
