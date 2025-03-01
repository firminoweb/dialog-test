const { readData, writeData, generateId } = require('../utils/dataHandler');
const LIKES_FILE = 'likes.json';
const POSTS_FILE = 'posts.json';

const getAllLikes = async (req, res) => {
  try {
    const likes = await readData(LIKES_FILE);
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter curtidas' });
  }
};

const getLikesByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const likes = await readData(LIKES_FILE);
    const postLikes = likes.filter(like => like.postId === postId);
    
    res.json(postLikes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter curtidas do post' });
  }
};

const getLikesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const likes = await readData(LIKES_FILE);

    const userLikes = likes.filter(like => like.userId === userId);
    
    res.json(userLikes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter curtidas do usuário' });
  }
};

const addLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
      return res.status(400).json({ error: 'ID do post e ID do usuário são obrigatórios' });
    }

    const posts = await readData(POSTS_FILE);
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const likes = await readData(LIKES_FILE);
    const existingLike = likes.find(like => like.postId === postId && like.userId === userId);
    
    if (existingLike) {
      return res.status(400).json({ error: 'Usuário já curtiu este post' });
    }
    
    const newLike = {
      id: generateId('like'),
      postId,
      userId,
      createdAt: new Date().toISOString()
    };
    
    likes.push(newLike);
    
    posts[postIndex].likesCount++;

    const likesSuccess = await writeData(LIKES_FILE, likes);
    const postsSuccess = await writeData(POSTS_FILE, posts);
    
    if (!likesSuccess || !postsSuccess) {
      return res.status(500).json({ error: 'Erro ao salvar curtida' });
    }
    
    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar curtida' });
  }
};


const removeLike = async (req, res) => {
  try {
    const likeId = req.params.id;
    const likes = await readData(LIKES_FILE);
    const likeToRemove = likes.find(like => like.id === likeId);
    
    if (!likeToRemove) {
      return res.status(404).json({ error: 'Curtida não encontrada' });
    }
    
    const updatedLikes = likes.filter(like => like.id !== likeId);
    const posts = await readData(POSTS_FILE);
    const postIndex = posts.findIndex(post => post.id === likeToRemove.postId);
    
    if (postIndex !== -1) {
      posts[postIndex].likesCount = Math.max(0, posts[postIndex].likesCount - 1);
    }
    
    const likesSuccess = await writeData(LIKES_FILE, updatedLikes);
    const postsSuccess = await writeData(POSTS_FILE, posts);
    
    if (!likesSuccess || !postsSuccess) {
      return res.status(500).json({ error: 'Erro ao remover curtida' });
    }
    
    res.json({ success: true, message: 'Curtida removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover curtida' });
  }
};

module.exports = {
  getAllLikes,
  getLikesByPostId,
  getLikesByUserId,
  addLike,
  removeLike
};
