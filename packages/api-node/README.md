# Social Feed - Backend API

API REST para a aplicação Social Feed, desenvolvida com Node.js e Express.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework para API REST
- **JSON** - Armazenamento de dados em arquivos locais

## Funcionalidades

A API fornece endpoints para:

- Gerenciamento de usuários (listar, obter, criar, atualizar)
- Gerenciamento de posts (listar, obter por ID, criar, atualizar, excluir)
- Interações de curtidas (adicionar, remover, listar)

## Estrutura do Projeto

```
api-node/
├── controllers/           # Controladores para cada entidade
│   ├── userController.js  # Lógica para usuários
│   ├── postController.js  # Lógica para posts
│   └── likeController.js  # Lógica para curtidas
├── data/                  # Arquivos JSON de dados
│   ├── users.json         # Usuários registrados
│   ├── posts.json         # Publicações dos usuários
│   └── likes.json         # Interações de curtidas
├── middleware/            # Middlewares do Express
│   └── cors.js            # Middleware CORS
├── routes/                # Definição das rotas da API
│   ├── userRoutes.js      # Rotas para usuários
│   ├── postRoutes.js      # Rotas para posts
│   └── likeRoutes.js      # Rotas para curtidas
├── utils/                 # Funções utilitárias
│   ├── dataHandler.js     # Manipulação de arquivos JSON
│   └── idGenerator.js     # Geração de IDs únicos
└── index.js               # Ponto de entrada da aplicação
```

## Instalação

### Pré-requisitos
- Node.js (v14+)
- npm ou Yarn

### Passos para Instalação

1. Entre na pasta do backend:
```bash
cd packages/api-node
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

## Executando a API

Para iniciar o servidor em modo desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Para iniciar em modo produção:

```bash
npm start
# ou
yarn start
```

O servidor estará disponível em http://localhost:3001

## Endpoints da API

### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/me` - Obtém o usuário atual (simulado)
- `GET /users/:id` - Obtém um usuário específico
- `POST /users` - Cria um novo usuário
- `PUT /users/:id` - Atualiza um usuário existente
- `DELETE /users/:id` - Remove um usuário

### Posts
- `GET /posts` - Lista todos os posts
- `GET /posts/:id` - Obtém um post específico
- `GET /posts/user/:userId` - Obtém posts de um usuário específico
- `POST /posts` - Cria um novo post
- `PUT /posts/:id` - Atualiza um post existente
- `DELETE /posts/:id` - Remove um post

### Curtidas
- `GET /likes` - Lista todas as curtidas
- `GET /likes/post/:postId` - Obtém curtidas de um post específico
- `GET /likes/user/:userId` - Obtém curtidas feitas por um usuário
- `POST /likes` - Adiciona uma curtida
- `DELETE /likes/:id` - Remove uma curtida

## Persistência de Dados

A API utiliza arquivos JSON para persistência de dados, localizados na pasta `data/`. Em um ambiente de produção, isso deveria ser substituído por um banco de dados real.

## Variáveis de Ambiente

A API suporta as seguintes variáveis de ambiente:

```
PORT=3001       # Porta onde o servidor será executado
```

## Limitações

- Esta é uma implementação simplificada sem autenticação real
- Os dados são armazenados em arquivos JSON, não em um banco de dados
- Não há validação robusta de entrada ou tratamento de erros completo