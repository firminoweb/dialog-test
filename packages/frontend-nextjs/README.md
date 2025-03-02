# Social Feed - Frontend

Interface do usuário para aplicação Social Feed, desenvolvida com Next.js e TypeScript.

## Tecnologias Utilizadas

- **Next.js 14** - Framework React moderno com SSR
- **TypeScript** - JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário para estilos
- **React Hooks** - Gerenciamento de estado e efeitos

## Funcionalidades

- Timeline de posts com scroll infinito
- Perfis de usuário com estatísticas
- Criação de posts com texto e imagens
- Sistema de curtidas
- Exclusão de posts próprios
- Design responsivo para mobile e desktop

## Estrutura do Projeto

```
frontend-nextjs/
├── app/                # Arquivos da aplicação Next.js
│   ├── components/     # Componentes reutilizáveis
│   │   ├── layout/     # Componentes de layout (Navbar, Footer)
│   │   ├── post/       # Componentes relacionados a posts
│   │   ├── profile/    # Componentes de perfil de usuário
│   │   └── ui/         # Componentes de UI genéricos
│   ├── post/           # Páginas de detalhes de post
│   ├── profile/        # Página de perfil
│   ├── globals.css     # Estilos globais
│   └── page.tsx        # Página inicial (timeline)
├── lib/                # Utilitários e tipos
│   ├── api.ts          # Cliente para comunicação com a API
│   └── types.ts        # Definições de tipos TypeScript
└── public/             # Arquivos estáticos
```

## Instalação

### Pré-requisitos
- Node.js (v16+)
- npm ou Yarn

### Passos para Instalação

1. Entre na pasta do frontend:
```bash
cd packages/frontend-nextjs
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

## Executando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em http://localhost:3000

Para uma build de produção:

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## Comunicação com o Backend

O frontend se comunica com a API REST através do cliente implementado em `lib/api.ts`.
Para funcionar corretamente, o backend deve estar rodando em http://localhost:3001.

## Testes

```bash
npm run test
# ou
yarn test
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Build e Deploy

Para gerar uma versão de produção:

```bash
npm run build
# ou
yarn build
```

Os arquivos gerados estarão na pasta `.next/`.
