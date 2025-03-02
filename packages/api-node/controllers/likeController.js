const { readData, writeData, generateId } = require('../utils/dataHandler');

const LIKES_FILE = 'likes.json';
const POSTS_FILE = 'posts.json';

const getAllLikes = async (req, res) => {
  try {
    const likes = await readData(LIKES_FILE);
    console.log(`GET /likes - Retornando ${likes.length} likes`);
    res.json({ success: true, data: likes });
  } catch (error) {
    console.error('Erro ao obter curtidas:', error);
    res.status(500).json({ success: false, error: 'Erro ao obter curtidas' });
  }
};

const getLikesByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(`GET /likes/post/${postId} - Buscando likes do post`);
    
    const likes = await readData(LIKES_FILE);
    const postLikes = likes.filter(like => like.postId === postId);
    console.log(`Encontrados ${postLikes.length} likes para o post ${postId}`);
    
    res.json({ success: true, data: postLikes });
  } catch (error) {
    console.error('Erro ao obter curtidas do post:', error);
    res.status(500).json({ success: false, error: 'Erro ao obter curtidas do post' });
  }
};

const getLikesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`GET /likes/user/${userId} - Buscando likes do usuário`);
    
    const likes = await readData(LIKES_FILE);
    const userLikes = likes.filter(like => like.userId === userId);
    console.log(`Encontrados ${userLikes.length} likes para o usuário ${userId}`);
    
    res.json({ success: true, data: userLikes });
  } catch (error) {
    console.error('Erro ao obter curtidas do usuário:', error);
    res.status(500).json({ success: false, error: 'Erro ao obter curtidas do usuário' });
  }
};

const addLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    
    console.log('POST /likes - Recebendo requisição:', { 
      body: req.body,
      postId, 
      userId 
    });
    
    if (!postId || !userId) {
      console.warn('Parâmetros incompletos:', { postId, userId, body: req.body });
      return res.status(400).json({ 
        success: false,
        error: 'ID do post e ID do usuário são obrigatórios' 
      });
    }
    
    const posts = await readData(POSTS_FILE);
    console.log(`Verificando post ${postId} entre ${posts.length} posts`);
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      console.warn(`Post ${postId} não encontrado`);
      return res.status(404).json({ 
        success: false,
        error: 'Post não encontrado' 
      });
    }
    
    const likes = await readData(LIKES_FILE);
    console.log(`Verificando se usuário ${userId} já curtiu o post ${postId} entre ${likes.length} likes`);
    const existingLike = likes.find(like => like.postId === postId && like.userId === userId);
    
    if (existingLike) {
      console.log(`Usuário ${userId} já curtiu o post ${postId}`);

      return res.status(200).json({ 
        success: true,
        data: existingLike,
        message: 'Post já curtido por este usuário' 
      });
    }
    
    const newLike = {
      id: generateId('like'),
      postId,
      userId,
      createdAt: new Date().toISOString()
    };
    
    console.log('Novo like criado:', newLike);
    likes.push(newLike);
    
    posts[postIndex].likesCount++;
    console.log(`Post ${postId} agora tem ${posts[postIndex].likesCount} curtidas`);
    
    console.log(`Salvando ${likes.length} likes no arquivo ${LIKES_FILE}`);
    const likesSuccess = await writeData(LIKES_FILE, likes);
    
    console.log(`Salvando ${posts.length} posts no arquivo ${POSTS_FILE}`);
    const postsSuccess = await writeData(POSTS_FILE, posts);
    
    if (!likesSuccess || !postsSuccess) {
      console.error('Erro ao salvar dados:', { likesSuccess, postsSuccess });
      return res.status(500).json({ 
        success: false,
        error: 'Erro ao salvar curtida' 
      });
    }
    
    console.log('Like adicionado com sucesso:', newLike);
    res.status(201).json({
      success: true,
      data: newLike
    });
  } catch (error) {
    console.error('Erro ao adicionar curtida:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao adicionar curtida' 
    });
  }
};

const removeLike = async (req, res) => {
  try {
    const likeId = req.params.id;
    console.log(`DELETE /likes/${likeId} - Removendo curtida`);
    
    const likes = await readData(LIKES_FILE);
    const likeToRemove = likes.find(like => like.id === likeId);
    
    if (!likeToRemove) {
      console.warn(`Like ${likeId} não encontrado`);
      return res.status(404).json({ 
        success: false,
        error: 'Curtida não encontrada' 
      });
    }
    
    console.log('Like encontrado para remoção:', likeToRemove);
    const updatedLikes = likes.filter(like => like.id !== likeId);
    const posts = await readData(POSTS_FILE);
    const postIndex = posts.findIndex(post => post.id === likeToRemove.postId);
    
    if (postIndex !== -1) {
      posts[postIndex].likesCount = Math.max(0, posts[postIndex].likesCount - 1);
      console.log(`Post ${likeToRemove.postId} agora tem ${posts[postIndex].likesCount} curtidas`);
    }
    
    console.log(`Salvando ${updatedLikes.length} likes no arquivo ${LIKES_FILE}`);
    const likesSuccess = await writeData(LIKES_FILE, updatedLikes);
    
    console.log(`Salvando ${posts.length} posts no arquivo ${POSTS_FILE}`);
    const postsSuccess = await writeData(POSTS_FILE, posts);
    
    if (!likesSuccess || !postsSuccess) {
      console.error('Erro ao salvar dados após remoção:', { likesSuccess, postsSuccess });
      return res.status(500).json({ 
        success: false,
        error: 'Erro ao remover curtida' 
      });
    }
    
    console.log('Like removido com sucesso');
    res.json({ 
      success: true, 
      message: 'Curtida removida com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao remover curtida:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao remover curtida' 
    });
  }
};

module.exports = {
  getAllLikes,
  getLikesByPostId,
  getLikesByUserId,
  addLike,
  removeLike
};
