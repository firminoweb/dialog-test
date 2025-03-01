const { readData, writeData, generateId } = require('../utils/dataHandler');

const POSTS_FILE = 'posts.json';
const USERS_FILE = 'users.json';

const getAllPosts = async (req, res) => {
  try {
    const posts = await readData(POSTS_FILE);
    const users = await readData(USERS_FILE);
    
    const postsWithUsers = posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: user ? {
          id: user.id,
          username: user.username,
          name: user.name,
          avatar: user.avatar
        } : null
      };
    });
    
    postsWithUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(postsWithUsers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const posts = await readData(POSTS_FILE);
    const users = await readData(USERS_FILE);
    
    const post = posts.find(post => post.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    const user = users.find(u => u.id === post.userId);
    const postWithUser = {
      ...post,
      user: user ? {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar
      } : null
    };
    
    res.json(postWithUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter post' });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await readData(POSTS_FILE);
    const userPosts = posts.filter(post => post.userId === userId);
    
    userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter posts do usuário' });
  }
};

const createPost = async (req, res) => {
  try {
    const { userId, content, imageUrl } = req.body;
    
    if (!userId || !content) {
      return res.status(400).json({ error: 'ID do usuário e conteúdo são obrigatórios' });
    }

    const users = await readData(USERS_FILE);
    const userExists = users.some(user => user.id === userId);
    
    if (!userExists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const posts = await readData(POSTS_FILE);
    
    const newPost = {
      id: generateId('post'),
      userId,
      content,
      imageUrl: imageUrl || '',
      likesCount: 0,
      createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    
    const success = await writeData(POSTS_FILE, posts);
    if (!success) {
      return res.status(500).json({ error: 'Erro ao salvar post' });
    }

    const user = users.find(u => u.id === userId);
    const postWithUser = {
      ...newPost,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar
      }
    };
    
    res.status(201).json(postWithUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const postId = req.params.id;
    
    const posts = await readData(POSTS_FILE);
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    if (content !== undefined) posts[postIndex].content = content;
    if (imageUrl !== undefined) posts[postIndex].imageUrl = imageUrl;
    
    const success = await writeData(POSTS_FILE, posts);
    if (!success) {
      return res.status(500).json({ error: 'Erro ao atualizar post' });
    }
    
    res.json(posts[postIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const posts = await readData(POSTS_FILE);
    const updatedPosts = posts.filter(post => post.id !== postId);
    
    if (posts.length === updatedPosts.length) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    const success = await writeData(POSTS_FILE, updatedPosts);
    if (!success) {
      return res.status(500).json({ error: 'Erro ao remover post' });
    }
    
    res.json({ success: true, message: 'Post removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover post' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost
};
