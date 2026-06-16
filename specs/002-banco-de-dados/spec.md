# Especificação: Banco de Dados — Modelo e Importação Oracle

**Branch**: `feat/002-banco-de-dados`

**Criado**: 2026-06-16

**Status**: Rascunho

**Entrada**: Modelo de dados do Oracle APEX 18 (51 tabelas AT_*) → PostgreSQL via Prisma

---

## Contexto e Descobertas

### Origem dos dados
O sistema Oracle APEX 18 usa duas fontes de dados separadas:
1. **Schema ATENA** — 51 tabelas `AT_*` com toda a lógica de trajetórias
2. **Schema SIAPE** — sistema de RH do TCU (externo ao ATENA), contém dados de pessoa física (`AT_PESSOA_FISICA`), nome, CPF, hierarquia funcional

As tabelas AT_* referenciam `COD_PESSOA_FISICA` (PK do SIAPE) como chave estrangeira. Não há tabela AT_PESSOA_FISICA no schema ATENA — ela é acessada via link de banco ou view.

### Implicação para o PostgreSQL
Precisamos criar uma tabela `Pessoa` no PostgreSQL que consolide:
- Dados de autenticação: `AT_USUARIO` (login, perfil)
- Dados pessoais: exportados do SIAPE (nome, matrícula — CPF removido na anonimização)
- Hierarquia: exportada do SIAPE ou reconstituída pela query Q07

---

## Cenários de Usuário e Testes *(obrigatório)*

### História 1 — Dados estruturais importados (Prioridade: P1)

O time técnico executa as queries de exportação no APEX SQL Workshop, faz download dos CSVs e importa no PostgreSQL. Após a importação, o sistema consegue exibir trajetórias disponíveis, competências por nível e o painel de usuários demo.

**Teste independente**: Executar `SELECT COUNT(*) FROM trajetoria` no PostgreSQL e obter resultado > 0. Executar `SELECT COUNT(*) FROM usuario` e obter pelo menos os 6 usuários demo.

**Cenários de aceite**:
1. **Dado** que as queries Q01–Q06 foram executadas, **Quando** o banco é consultado, **Então** retorna trajetórias, níveis, competências e comportamentos
2. **Dado** que o seed de demo foi aplicado, **Quando** o login é feito com `usuario.a`/`demo`, **Então** o sistema autentica com sucesso

### História 2 — Dados transacionais importados (Prioridade: P2)

O time importa os dados de adesões, autoavaliações e posições atuais dos 50 servidores ativos. O dashboard mostra dados reais do Oracle, não placeholders.

**Teste independente**: Fazer login com um usuário que tenha adesão no Oracle e verificar que o dashboard mostra a trajetória correta.

**Cenários de aceite**:
1. **Dado** que Q07–Q10 foram importadas, **Quando** um servidor acessa o dashboard, **Então** vê sua posição real (trajetória + nível) conforme Oracle
2. **Dado** que os dados de autoavaliação foram importados, **Quando** o servidor acessa a tela de avaliação, **Então** vê seus graus salvos anteriormente

### Casos extremos

- O que acontece se um servidor do Oracle não tiver usuário no APEX (AT_USUARIO)? → Não importar — só importar quem tem login ativo
- O que acontece com registros com `DTHORA_FIM_VIGENCIA` preenchida (inativas)? → Excluir da importação — importar apenas vigentes
- O que acontece com BLOBs (arquivos, imagens)? → Ignorar na importação MVP — campos de arquivo ficam nulos

---

## Tabelas do MVP — mapeamento Oracle → PostgreSQL

### Tabelas estruturais (referenciais — mudam raramente)

| Tabela Oracle | Modelo PostgreSQL | Descrição |
|--------------|-----------------|-----------|
| `AT_TRAJETORIA` | `Trajetoria` | Trajetórias profissionais |
| `AT_TRAJETORIA_NIVEL` | `TrajetoriaNivel` | Níveis de cada trajetória |
| `AT_COMPETENCIA` | `Competencia` | Competências |
| `AT_SUBCOMPETENCIA` | `Comportamento` | Comportamentos (chamados "subcompetências" no Oracle) |
| `AT_TRAJETORIA_COMPETENCIA` | `TrajetoriaCompetencia` | Quais competências compõem cada trajetória |
| `AT_ESPACO_OCUPACIONAL` | `EspacoOcupacional` | Espaços de atuação |
| `AT_TRAJETORIA_ESPACO_OCUP` | `TrajetoriaEspaco` | Quais espaços uma trajetória atende |

### Tabelas de usuários (auth + seed)

| Tabela Oracle | Modelo PostgreSQL | Descrição |
|--------------|-----------------|-----------|
| `AT_USUARIO` | `Usuario` (parcial) | Login e perfil (USUARIO/GESTOR/ADMIN) |
| SIAPE (externo) | `Pessoa` | Nome, matrícula — exportado via query Q07 |

> `Usuario` e `Pessoa` são unificados no modelo PostgreSQL em `Pessoa` (inclui login + nome + perfil + hierarquia)

### Tabelas transacionais (dados do servidor)

| Tabela Oracle | Modelo PostgreSQL | Descrição |
|--------------|-----------------|-----------|
| `AT_PESSOA_TRAJETORIA` | `PessoaTrajetoria` | Adesão de um servidor a uma trajetória |
| `AT_PESSOA_TRAJETORIA_NIVEL` | `PessoaTrajetoriaNivel` | Nível atual do servidor na trajetória |
| `AT_PESSOA_SUBCOMPETENCIA` | `PessoaAutoavaliacao` | Autoavaliação de um comportamento |

### Fora do MVP (pós-MVP)

`AT_PESSOA_EVIDENCIA`, `AT_PESSOA_REQUISITO`, `AT_DELEGACAO_AVALIACAO`, `AT_AVALIACAO_AVALIADOR`, família `AT_REQUISITO_*`, família `AT_TRJ_NVL_*`

---

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O banco DEVE ter todas as tabelas estruturais populadas antes de qualquer feature ser testada
- **RF-002**: O sistema DEVE importar apenas registros com `DTHORA_FIM_VIGENCIA` nula (vigentes)
- **RF-003**: A tabela `Pessoa` DEVE conter matrícula TCU e nome de exibição; CPF DEVE ser removido na anonimização
- **RF-004**: A senha de todos os usuários no seed DEVE ser o hash de `demo`
- **RF-005**: Os 6 usuários demo (usuario.a/b/c, gestor.d/e, admin.isc) DEVEM existir independentemente dos dados Oracle
- **RF-006**: A hierarquia demo (A chefia B e C; D e E homologam A/B/C) DEVE estar configurada no seed
- **RF-007**: O banco DEVE ter pelo menos 50 servidores ativos com adesões reais importadas do Oracle
- **RF-008**: Campos BLOB (arquivos, conteúdo binário) DEVEM ser ignorados na importação MVP

### Mapeamento de tipos Oracle → PostgreSQL

| Oracle | PostgreSQL | Observação |
|--------|-----------|-----------|
| `NUMBER` (sem escala) | `Int` | Se PK ou FK |
| `NUMBER` (com escala) | `Decimal` | Valores monetários ou métricas |
| `VARCHAR2(N)` | `String` | `@db.VarChar(N)` |
| `CHAR(1)` flag | `Boolean` | `'S'/'N'` → `true/false` |
| `CHAR(3)` enum | `String` | Manter como string no MVP |
| `DATE` | `DateTime` | Oracle DATE tem hora |
| `CLOB` | `String` | `@db.Text` |
| `BLOB` | ignorar | Fora do MVP |

---

## Critérios de Sucesso *(obrigatório)*

- **CS-001**: Migrations rodam sem erro em banco PostgreSQL limpo (`prisma migrate dev`)
- **CS-002**: Seed completo executa em menos de 60 segundos
- **CS-003**: Consulta de trajetórias com seus níveis e competências retorna em menos de 500ms
- **CS-004**: Os 6 usuários demo conseguem autenticar após o seed
- **CS-005**: Os dados de pelo menos 10 servidores com autoavaliações aparecem corretamente no dashboard

---

## Premissas

- O usuário tem acesso ao APEX SQL Workshop do sistema Trajetórias produção
- O usuário pode exportar resultados de query como CSV no APEX
- Os CSVs exportados são salvos em `seed/oracle-exports/` e **nunca commitados** (`.gitignore`)
- A anonimização é feita na query Oracle antes do download (nome → "Servidor [ID]", CPF omitido)
- A hierarquia de gestão vem de uma query sobre o SIAPE via APEX (Q07)
- `AT_PESSOA_FISICA` é acessível via APEX mesmo sendo do schema SIAPE
