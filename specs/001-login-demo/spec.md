# Especificação: Login Demo

**Branch**: `feat/001-login-demo`

**Criado**: 2026-06-16

**Status**: Rascunho

**Entrada**: Tela de login demo com painel de usuários disponíveis e controle de acesso por perfil

---

## Cenários de Usuário e Testes *(obrigatório)*

### História 1 — Servidor acessa o sistema (Prioridade: P1)

Um servidor do TCU abre o sistema pela primeira vez e precisa se identificar para acessar suas trajetórias profissionais. Ele vê uma tela de login limpa, com um painel mostrando todos os usuários disponíveis e suas senhas de demonstração, escolhe seu usuário, digita a senha e entra no sistema.

**Por que esta prioridade**: É o ponto de entrada de todas as outras funcionalidades. Sem login nada funciona. É o primeiro passo da jornada de demonstração para o time NuPlan/ISC.

**Teste independente**: Pode ser testado completamente acessando a URL raiz do sistema, fazendo login com `usuario.a` / `demo` e verificando o redirecionamento para o dashboard do servidor.

**Cenários de aceite**:

1. **Dado** que o usuário está na tela de login, **Quando** ele digita `usuario.a` e `demo` e confirma, **Então** é redirecionado para o dashboard de servidor com seu nome exibido no header
2. **Dado** que o usuário está na tela de login, **Quando** ele digita uma senha errada, **Então** vê uma mensagem de erro clara e o formulário permanece na tela
3. **Dado** que o usuário está na tela de login, **Quando** ele digita um usuário inexistente, **Então** vê mensagem de erro (sem revelar se o usuário existe ou não)
4. **Dado** que o usuário está na tela de login em modo demonstração, **Quando** visualiza a tela, **Então** vê o painel com todos os 6 usuários disponíveis, seus perfis e a senha `demo`
5. **Dado** que o usuário clica em um usuário no painel de demonstração, **Quando** o clique ocorre, **Então** o campo "Usuário TCU" é preenchido automaticamente com aquele usuário

---

### História 2 — Gestor acessa o sistema (Prioridade: P2)

Um gestor do TCU precisa acessar o sistema para visualizar a fila de homologações de seus subordinados. Ele faz login com seu usuário de gestor e é redirecionado para uma visão diferente da do servidor.

**Por que esta prioridade**: Valida que o sistema distingue perfis corretamente — fundamental para a demonstração mostrar os três níveis de acesso.

**Teste independente**: Pode ser testado fazendo login com `gestor.d` / `demo` e verificando que a tela inicial é diferente da do servidor.

**Cenários de aceite**:

1. **Dado** que o gestor faz login com `gestor.d` / `demo`, **Quando** é redirecionado, **Então** vê a visão de gestor (não a de servidor)
2. **Dado** que o gestor está logado, **Quando** tenta acessar uma rota exclusiva de servidor, **Então** é redirecionado para sua área correta

---

### História 3 — Troca de usuário durante demonstração (Prioridade: P3)

Durante a apresentação ao time NuPlan/ISC, o apresentador precisa mostrar o sistema sob a perspectiva de diferentes atores sem precisar fazer logout completo e lembrar a senha a cada troca.

**Por que esta prioridade**: Melhora significativamente a experiência de demonstração, mas não bloqueia o funcionamento básico.

**Teste independente**: Pode ser testado clicando no botão "Trocar usuário" no header e verificando que retorna à tela de login sem precisar apagar manualmente os campos.

**Cenários de aceite**:

1. **Dado** que qualquer usuário está logado em modo demonstração, **Quando** clica em "Trocar usuário" no header, **Então** é redirecionado para a tela de login com os campos limpos
2. **Dado** que o usuário fez logout ou trocou de usuário, **Quando** tenta acessar uma rota protegida, **Então** é redirecionado para o login

---

### Casos extremos

- O que acontece se o usuário fechar o navegador e reabrir? → Sessão deve persistir (o usuário continua logado)
- O que acontece se o mesmo usuário fizer login em duas abas? → Ambas as sessões são válidas
- O que acontece se o campo usuário for enviado em branco? → Mensagem de erro de validação antes de qualquer chamada ao servidor
- O que acontece em tela pequena (celular)? → O painel de usuários disponíveis deve ser ocultável ou empilhado verticalmente

---

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O sistema DEVE exibir tela de login com campo "Usuário TCU" e campo "Senha"
- **RF-002**: O sistema DEVE autenticar o usuário quando ele fornece matrícula válida e a senha `demo`
- **RF-003**: O sistema DEVE redirecionar o usuário para a área correspondente ao seu perfil após login bem-sucedido (USUARIO → dashboard do servidor; GESTOR → visão do gestor; ADMIN → painel de administração)
- **RF-004**: O sistema DEVE exibir mensagem de erro genérica para credenciais inválidas, sem revelar qual campo está errado
- **RF-005**: O sistema DEVE exibir painel de usuários disponíveis em modo demonstração, contendo: usuário, senha (`demo`), perfil e relacionamentos hierárquicos
- **RF-006**: O sistema DEVE preencher automaticamente o campo "Usuário TCU" quando o usuário clicar em um item do painel de demonstração
- **RF-007**: O sistema DEVE exibir botão "Trocar usuário" no header para todos os usuários logados em modo demonstração
- **RF-008**: O sistema DEVE encerrar a sessão do usuário ao clicar em "Sair" e redirecioná-lo para a tela de login
- **RF-009**: O sistema DEVE proteger todas as rotas autenticadas, redirecionando para o login caso o usuário não esteja autenticado
- **RF-010**: O sistema DEVE persistir a sessão do usuário entre fechamentos e reabertura do navegador

### Entidades Principais

- **Usuário**: Representa um servidor do TCU com atributos de identificação, perfil de acesso e relacionamentos hierárquicos (subordinados e chefes)
- **Sessão**: Representa o estado de autenticação de um usuário — ativa ou encerrada
- **Perfil**: Define o nível de acesso do usuário — USUARIO, GESTOR ou ADMIN

---

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: Qualquer dos 6 usuários demo consegue fazer login em menos de 10 segundos a partir da tela inicial
- **CS-002**: 100% das rotas protegidas redirecionam para o login quando acessadas sem autenticação
- **CS-003**: A troca de usuário (logout + novo login) leva menos de 5 segundos durante a demonstração
- **CS-004**: O painel de usuários disponíveis é visível e legível sem rolagem em tela de 1280px ou maior
- **CS-005**: A tela de login é utilizável em dispositivos com tela de 375px de largura (celular)

---

## Premissas

- O sistema opera em modo demonstração (`DEMO_MODE=true`) — não há gestão real de senhas
- Todos os 6 usuários demo existem no banco de dados com seus perfis e hierarquias configurados
- A sessão é gerenciada pelo próprio sistema, sem dependência de SSO externo (Portal TCU)
- O painel de usuários disponíveis é exibido apenas quando `DEMO_MODE=true` está ativo
- A hierarquia entre os usuários (quem é subordinado de quem) já está definida: A→B,C; chefes D,E
