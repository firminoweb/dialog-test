const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const corsMiddleware = require('./middleware/cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const setupDataDir = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });

    const files = [
      { name: 'users.json', defaultContent: [] },
      { name: 'posts.json', defaultContent: [] },
      { name: 'likes.json', defaultContent: [] },
    ];
    
    for (const file of files) {
      const filePath = path.join(dataDir, file.name);
      try {
        await fs.access(filePath);
        
        const content = await fs.readFile(filePath, 'utf8');
        if (!content || content.trim() === '') {
          await fs.writeFile(filePath, JSON.stringify(file.defaultContent, null, 2));
          console.log(`Arquivo ${file.name} estava vazio e foi inicializado.`);
        } else {
          try {
            JSON.parse(content);
          } catch (parseError) {
            await fs.writeFile(filePath, JSON.stringify(file.defaultContent, null, 2));
            console.log(`Arquivo ${file.name} continha JSON inválido e foi redefinido.`);
          }
        }
      } catch (error) {
        await fs.writeFile(filePath, JSON.stringify(file.defaultContent, null, 2));
        console.log(`Arquivo ${file.name} criado com sucesso.`);
      }
    }
    
    await populateInitialData();
  } catch (error) {
    console.error('Erro ao configurar diretório de dados:', error);
  }
};

const populateInitialData = async () => {
  const usersPath = path.join(dataDir, 'users.json');
  let users = [];
  
  try {
    const usersData = await fs.readFile(usersPath, 'utf8');
    if (usersData && usersData.trim() !== '') {
      users = JSON.parse(usersData);
    }
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
  
  const postsPath = path.join(dataDir, 'posts.json');
  let posts = [];
  
  try {
    const postsData = await fs.readFile(postsPath, 'utf8');
    if (postsData && postsData.trim() !== '') {
      posts = JSON.parse(postsData);
    }
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
  
  const likesPath = path.join(dataDir, 'likes.json');
  let likes = [];
  
  try {
    const likesData = await fs.readFile(likesPath, 'utf8');
    if (likesData && likesData.trim() !== '') {
      likes = JSON.parse(likesData);
    }
  } catch (error) {
    console.error('Erro ao ler arquivo de likes:', error);
  }
  
  if (likes.length === 0) {
    const sampleLikes = [
      {
        id: 'like1',
        postId: 'post1',
        userId: 'user456',
        createdAt: new Date('2024-01-10T16:45:00').toISOString()
      },
      {
        id: 'like2',
        postId: 'post2',
        userId: 'user123',
        createdAt: new Date('2024-01-12T10:20:00').toISOString()
      }
    ];
    
    await fs.writeFile(likesPath, JSON.stringify(sampleLikes, null, 2));
    console.log('Likes de exemplo criados com sucesso.');
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
