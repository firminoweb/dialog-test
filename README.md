# Social Feed - Teste Técnico - Dialog

Uma aplicação de rede social minimalista que permite aos usuários criar perfis, publicar posts e interagir com curtidas. Este projeto foi desenvolvido como parte de um desafio técnico para demonstrar habilidades em desenvolvimento fullstack.

## Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com SSR
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **React Hooks** - Para gerenciamento de estado

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework para API REST
- **JSON** - Armazenamento de dados em arquivos (sem banco de dados)

## Estrutura do Projeto

O projeto é organizado como um monorepo com as seguintes pastas principais:

```
dialog-test/
├── packages/
│   ├── api-node/          # Backend com Node.js
│   └── frontend-nextjs/   # Frontend com Next.js
├── README.md
└── package.json
```

## Funcionalidades

- **Perfis de Usuário**: Visualização de perfis com informações básicas
- **Timeline de Posts**: Feed de publicações de usuários
- **Publicação de Posts**: Criação de novas publicações
- **Curtidas**: Interação com posts através de curtidas
- **Exclusão de Posts**: Remoção de publicações próprias

## Instalação

### Pré-requisitos
- Node.js (v16+)
- Yarn ou npm

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/firminoweb/dialog-test.git
cd dialog-test
```

2. Instale as dependências do projeto:
```bash
# Instalar dependências do frontend
cd packages/frontend-nextjs
npm install

# Instalar dependências do backend
cd ../api-node
npm install
```

## Executando o Projeto

### Backend (API Node.js)

```bash
cd packages/api-node
npm run dev
```

O servidor estará disponível em: http://localhost:3001

### Frontend (Next.js)

```bash
cd packages/frontend-nextjs
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

## Desenvolvimento

### Estrutura de Dados

O backend utiliza arquivos JSON para armazenar dados:
- `users.json` - Informações dos usuários
- `posts.json` - Publicações dos usuários
- `likes.json` - Interações de curtidas

### Fluxo de Autenticação

Para simplificar, a aplicação não implementa autenticação real, mas simula um usuário logado com ID fixo (`user123`).

## Contribuindo

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.