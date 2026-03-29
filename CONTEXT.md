# Sabiá Digital — Contexto do Projeto

> Cole este arquivo na raiz do projeto e mantenha-o aberto no VS Code.
> O Claude usará estas informações como referência em todas as sessões de desenvolvimento.

---

## Visão geral

Aplicativo municipal para a cidade de Carnaíba - PE.
Plataforma digital que conecta cidadãos aos serviços da prefeitura e ao comércio local.
Formato: PWA (Progressive Web App) — acessado por URL, instalável no celular, sem Play Store.

---

## Stack tecnológica — DECISÃO FINAL

| Camada | Tecnologia | Observação |
|---|---|---|
| Backend | Laravel 11 (PHP 8.2) | Gerencia rotas, banco e lógica |
| Frontend | React + Inertia.js | Dentro do próprio Laravel |
| Estilização | Tailwind CSS | Classes utilitárias |
| Banco de dados | PostgreSQL | ORM Eloquent do Laravel |
| Arquivos/fotos | Cloudflare R2 | Fotos de cardápio e documentos |
| Notificações push | Firebase FCM | Android — status de matrícula etc. |
| Hospedagem | Hostoo.io (Plano Pro) | Tudo em um servidor só |
| Repositório | GitHub | Um único repositório |

**Arquitetura:** Laravel + Inertia.js — tudo em um projeto só, uma hospedagem só.
O Laravel serve o backend e o frontend React via Inertia. Sem API separada, sem CORS.
Em desenvolvimento: `php artisan serve` + `npm run dev` (compilação do JS).
Em produção na Hostoo: só o PHP roda após `npm run build`.

---

## Módulos do MVP

### 1. Educação
- Listagem de escolas municipais com endereço e contato
- Mapa de escolas (link externo ou embed)
- Matrícula online com upload de documentos
- Acompanhamento de status da matrícula com protocolo
- Calendário escolar por unidade
- Consulta de vagas disponíveis por série

### 2. Urbanismo
- **Não tem módulo próprio**
- Apenas um card na home que abre o site já existente da prefeitura
- Implementação: `window.open('URL_DO_SITE_DA_PREFEITURA')`

### 3. Marketplace local (nome a definir)
- Listagem de estabelecimentos com filtro por categoria
- Página do estabelecimento com informações e horários
- Cardápio digital com categorias e itens
- Carrinho de compras
- Pedido enviado via WhatsApp (mensagem gerada automaticamente pelo app)
- Pagamento via Pix (chave do estabelecimento exibida no app)
- Perfil do estabelecimento: cadastro, cardápio, status aberto/fechado

### 4. Painel do empreendedor
- Listagem de cursos e treinamentos disponíveis
- Detalhe do curso (carga horária, datas, vagas, local)
- Matrícula em curso pelo app (para dono e funcionário)
- Histórico de inscrições

### 5. Informações públicas
- Feed de notícias da prefeitura
- Detalhe da notícia
- Eventos municipais
- Editais e licitações

### 6. Telefones úteis
- Lista de secretarias e órgãos municipais
- Nome, telefone, endereço e horário de atendimento
- Botão que liga diretamente
- Botão que abre WhatsApp com número preenchido

### 7. Painel da prefeitura (admin)
- Dashboard com indicadores gerais
- Gestão de matrículas escolares (ver, confirmar, recusar)
- Gestão de estabelecimentos do marketplace (aprovar cadastros)
- Gestão de cursos (criar, editar, ver inscritos)
- Publicar notícias e eventos
- Gerenciar telefones úteis
- Acesso restrito a servidores da prefeitura

---

## Perfis de usuário

| Perfil | Acesso | Identificação |
|---|---|---|
| Cidadão | App completo (cliente) | E-mail + CPF + senha |
| Dono de estabelecimento | Perfil marketplace + app cidadão | E-mail + CPF + senha |
| Servidor da prefeitura | Painel admin | E-mail + senha (sem CPF obrigatório) |

---

## Autenticação

- Login: e-mail + senha
- CPF: coletado no cadastro do cidadão para vinculação com serviços municipais
- Biblioteca: Laravel Sanctum (token-based para SPA/Inertia)
- Sem Gov.br no MVP (fase 2)
- Sem login social no MVP

---

## LGPD — regras obrigatórias

- Consentimento explícito no cadastro (checkbox não pré-marcado)
- Consentimento obrigatório 1: uso do CPF e e-mail para identificação nos serviços municipais
- Consentimento opcional: receber notificações e comunicados
- GPS **não é coletado** (urbanismo virou link externo)
- Câmera: apenas para upload de documentos na matrícula (opcional)
- Política de privacidade em tela dedicada dentro do app
- Tela de configurações de privacidade com opção de excluir conta
- DPO da prefeitura com e-mail de contato na política
- Base legal do CPF: execução de política pública (art. 7º, III da LGPD)
- Base legal do e-mail: consentimento (art. 7º, I da LGPD)
- Dados mantidos enquanto conta ativa + até 5 anos após exclusão para auditoria

---

## Estrutura de pastas do projeto

```
sabia-digital/                     ← raiz do projeto (um único repositório)
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── EducacaoController.php
│   │   │   ├── MarketplaceController.php
│   │   │   ├── EmpreendedorController.php
│   │   │   ├── NoticiaController.php
│   │   │   ├── TelefoneController.php
│   │   │   └── Admin/
│   │   │       └── AdminController.php
│   │   ├── Middleware/
│   │   │   ├── AuthMiddleware.php
│   │   │   └── AdminMiddleware.php
│   │   └── Requests/
│   │       ├── CadastroRequest.php
│   │       ├── MatriculaRequest.php
│   │       └── EstabelecimentoRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Escola.php
│   │   ├── Matricula.php
│   │   ├── Estabelecimento.php
│   │   ├── ItemCardapio.php
│   │   ├── Curso.php
│   │   ├── InscricaoCurso.php
│   │   ├── Noticia.php
│   │   ├── Telefone.php
│   │   └── Consentimento.php
│   └── Services/
│       ├── AuthService.php
│       ├── MatriculaService.php
│       ├── MarketplaceService.php
│       └── NotificacaoService.php        ← Firebase FCM
│
├── database/
│   └── migrations/
│       ├── create_users_table.php
│       ├── create_consentimentos_table.php
│       ├── create_escolas_table.php
│       ├── create_matriculas_table.php
│       ├── create_estabelecimentos_table.php
│       ├── create_itens_cardapio_table.php
│       ├── create_cursos_table.php
│       ├── create_inscricoes_cursos_table.php
│       ├── create_noticias_table.php
│       └── create_telefones_table.php
│
├── resources/
│   └── js/
│       ├── Pages/                         ← telas React (Inertia)
│       │   ├── Auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Cadastro.jsx
│       │   │   └── Privacidade.jsx
│       │   ├── Home.jsx
│       │   ├── Educacao/
│       │   │   ├── Index.jsx
│       │   │   └── Matricula.jsx
│       │   ├── Marketplace/
│       │   │   ├── Index.jsx
│       │   │   ├── Estabelecimento.jsx
│       │   │   └── Carrinho.jsx
│       │   ├── Empreendedor/
│       │   │   ├── Index.jsx
│       │   │   └── Curso.jsx
│       │   ├── Noticias/
│       │   │   ├── Index.jsx
│       │   │   └── Detalhe.jsx
│       │   ├── Telefones/
│       │   │   └── Index.jsx
│       │   └── Admin/
│       │       ├── Dashboard.jsx
│       │       ├── Educacao.jsx
│       │       ├── Marketplace.jsx
│       │       ├── Cursos.jsx
│       │       └── Noticias.jsx
│       ├── Components/                    ← componentes reutilizáveis
│       │   ├── ui/                        ← botões, cards, inputs, badges
│       │   ├── layout/                    ← header, menu inferior, sidebar admin
│       │   └── modulos/                   ← componentes específicos de cada módulo
│       └── app.jsx                        ← entrada do React + Inertia
│
├── routes/
│   └── web.php                            ← rotas Inertia (retornam páginas React)
│
├── public/
│   ├── manifest.json                      ← torna o app instalável (PWA)
│   └── icons/                             ← ícones do app em vários tamanhos
│
├── .env                                   ← NUNCA no Git
├── composer.json                          ← dependências PHP
└── package.json                           ← dependências JS (React, Inertia, Tailwind)
```

---

## Banco de dados — tabelas principais

### users
- id, name, email, cpf, password, role (cidadao | estabelecimento | admin)
- email_verified_at, remember_token, timestamps

### consentimentos
- id, user_id (FK), tipo, aceito (boolean), aceito_em, ip_address, timestamps

### escolas
- id, nome, endereco, telefone, diretor, series_atendidas, total_vagas, timestamps

### matriculas
- id, user_id (FK), escola_id (FK), aluno_nome, aluno_cpf, aluno_nascimento
- serie_solicitada, status (pendente | em_analise | aprovada | recusada)
- protocolo, observacao, timestamps

### estabelecimentos
- id, user_id (FK), nome, categoria, descricao, whatsapp, chave_pix
- aceita_delivery (boolean), aceita_retirada (boolean), taxa_entrega
- status (pendente | ativo | inativo), aprovado_em, timestamps

### itens_cardapio
- id, estabelecimento_id (FK), categoria, nome, descricao, preco, disponivel (boolean), timestamps

### cursos
- id, titulo, descricao, instrutor, carga_horaria, data_inicio, data_fim
- local, vagas_total, vagas_disponiveis, status (ativo | encerrado), timestamps

### inscricoes_cursos
- id, user_id (FK), curso_id (FK), nome_participante, cpf_participante
- tipo (dono | funcionario), status (pendente | confirmada | cancelada), timestamps

### noticias
- id, titulo, conteudo, resumo, publicado (boolean), publicado_em, timestamps

### telefones
- id, secretaria, responsavel, telefone, whatsapp, endereco, horario, timestamps

---

## Regras de negócio importantes

### Marketplace
- Pedido nunca é processado pelo app — app gera mensagem WhatsApp e exibe chave Pix
- Estabelecimento precisa ser aprovado pelo admin antes de aparecer na listagem
- Status aberto/fechado é controlado pelo próprio dono no app
- Foto dos itens vai para Cloudflare R2

### Educação
- Matrícula gera protocolo único no formato MAT-ANO-SEQUENCIAL
- Status segue fluxo: pendente → em_análise → aprovada/recusada
- Cidadão recebe notificação push a cada mudança de status
- Documentos anexados vão para Cloudflare R2

### Painel do empreendedor
- Matrícula pode ser feita em nome do próprio dono ou de um funcionário
- Curso com vagas_disponiveis = 0 ainda aparece com badge "Lista de espera"

### Autenticação
- CPF é armazenado com hash (bcrypt) — nunca em texto puro
- Token de sessão via Laravel Sanctum
- Middleware admin verifica role = 'admin' antes de qualquer rota do painel

---

## Variáveis de ambiente (.env)

```env
APP_NAME="Sabiá Digital"
APP_URL=https://sabia.carnaiba.pe.gov.br

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=sabia_digital
DB_USERNAME=
DB_PASSWORD=

FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_URL=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@sabia.carnaiba.pe.gov.br
MAIL_FROM_NAME="Sabiá Digital"
```

---

## Como pedir código ao Claude — instruções para o desenvolvedor

### Antes de cada sessão
1. Abra este arquivo (CONTEXT.md) em uma aba do VS Code
2. Abra também o arquivo que vai editar
3. O Claude vai usar os dois como contexto automaticamente

### Como formatar os pedidos
Seja específico. Em vez de "cria o módulo de educação", peça:

> "Com base no CONTEXT.md, cria a migration `create_matriculas_table` com todos os campos definidos na seção de banco de dados. Use PostgreSQL."

> "Com base no CONTEXT.md, cria o `MatriculaController` com os métodos `index` (lista matrículas do usuário logado), `store` (cria nova matrícula com validação) e `show` (detalhe com protocolo). Use Inertia::render para retornar as páginas."

> "Com base no CONTEXT.md, cria a página React `Educacao/Matricula.jsx` com o formulário de matrícula: campos nome do aluno, CPF, data de nascimento, série desejada e escola. Use Tailwind para estilização."

### Ordem de desenvolvimento recomendada
1. Migrations (banco de dados)
2. Models com relacionamentos
3. Controllers + rotas (web.php)
4. Páginas React (resources/js/Pages/)
5. Componentes reutilizáveis (resources/js/Components/)
6. Services (lógica complexa)

### O que nunca fazer
- Nunca commitar o `.env` no GitHub
- Nunca armazenar CPF em texto puro — sempre usar hash
- Nunca colocar lógica de negócio diretamente no Controller — usar Services
- Nunca chamar o banco diretamente nas páginas React — sempre via Controller/Inertia

---

## Estado atual do desenvolvimento

**Fase:** Configuração inicial — projeto ainda não criado

**Próximo passo:** Rodar os comandos de criação do projeto e instalar dependências

```bash
composer create-project laravel/laravel sabia-digital
cd sabia-digital
composer require inertiajs/inertia-laravel
php artisan install:api
npm install @inertiajs/react react react-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Atualizar esta seção** a cada fase concluída para manter o Claude contextualizado.

---

*Versão 1.0 — Sabiá Digital MVP*
*Cidade: Carnaíba - PE | Desenvolvido com auxílio de IA (Claude)*
