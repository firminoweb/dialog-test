// api-node/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Garantir que os diretórios existam
const dataDir = path.join(__dirname, 'data');
const setupDataDir = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    // Verificar e criar arquivos JSON iniciais se não existirem
    const files = [
      { name: 'users.json', defaultContent: [] },
      { name: 'posts.json', defaultContent: [] },
      { name: 'likes.json', defaultContent: [] },
    ];
    
    for (const file of files) {
      const filePath = path.join(dataDir, file.name);
      try {
        await fs.access(filePath);
      } catch (error) {
        // Arquivo não existe, criar com conteúdo padrão
        await fs.writeFile(filePath, JSON.stringify(file.defaultContent, null, 2));
        console.log(`Arquivo ${file.name} criado com sucesso.`);
      }
    }
    
    // Adicionar alguns dados de exemplo se os arquivos estiverem vazios
    await populateInitialData();
  } catch (error) {
    console.error('Erro ao configurar diretório de dados:', error);
  }
};

// Função para popular dados iniciais
const populateInitialData = async () => {
  // Dados de exemplo para users.json
  const usersPath = path.join(dataDir, 'users.json');
  let users = [];
  try {
    const usersData = await fs.readFile(usersPath, 'utf8');
    users = JSON.parse(usersData);
  } catch (error) {
    console.error('Erro ao ler arquivo de usuários:', error);
  }
  
  if (users.length === 0) {
    const sampleUsers = [
      {
        id: 'user123',
        username: 'joao.silva',
        name: 'João Silva',
        bio: 'Desenvolvedor web apaixonado por tecnologia',
        avatar: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date('2023-01-15').toISOString()
      },
      {
        id: 'user456',
        username: 'maria.santos',
        name: 'Maria Santos',
        bio: 'Designer UX/UI | Amante de café',
        avatar: 'https://i.pravatar.cc/150?img=5',
        createdAt: new Date('2023-02-20').toISOString()
      }
    ];
    
    await fs.writeFile(usersPath, JSON.stringify(sampleUsers, null, 2));
    console.log('Usuários de exemplo criados com sucesso.');
    users = sampleUsers;
  }
  
  // Dados de exemplo para posts.json
  const postsPath = path.join(dataDir, 'posts.json');
  let posts = [];
  try {
    const postsData = await fs.readFile(postsPath, 'utf8');
    posts = JSON.parse(postsData);
  } catch (error) {
    console.error('Erro ao ler arquivo de posts:', error);
  }
  
  if (posts.length === 0) {
    const samplePosts = [
      {
        id: 'post1',
        userId: 'user123',
        content: 'Acabei de começar um novo projeto com Next.js e estou adorando a experiência!',
        likesCount: 5,
        createdAt: new Date('2024-01-10T14:30:00').toISOString()
      },
      {
        id: 'post2',
        userId: 'user456',
        content: 'Dica do dia: use Tailwind CSS para agilizar seu desenvolvimento front-end.',
        imageUrl: 'https://picsum.photos/id/1/600/400',
        likesCount: 8,
        createdAt: new Date('2024-01-12T09:15:00').toISOString()
      },
      {
        id: 'post3',
        userId: 'user123',
        content: 'Alguém aqui já trabalhou com Node.js e Express? Estou precisando de algumas dicas para minha API.',
        likesCount: 3,
        createdAt: new Date('2024-01-15T18:45:00').toISOString()
      }
    ];
    
    await fs.writeFile(postsPath, JSON.stringify(samplePosts, null, 2));
    console.log('Posts de exemplo criados com sucesso.');
  }
};

// Carregar rotas
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');

// Usar rotas
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/likes', likeRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'API de Social Feed funcionando!' });
});

// Iniciar servidor
const startServer = async () => {
  await setupDataDir();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();

module.exports = app;
