const { readData, writeData, generateId } = require('../utils/dataHandler');
const USERS_FILE = 'users.json';

const getAllUsers = async (req, res) => {
  try {
    const users = await readData(USERS_FILE);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
};

const getUserById = async (req, res) => {
  try {
    const users = await readData(USERS_FILE);
    const user = users.find(user => user.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const users = await readData(USERS_FILE);
    const currentUser = users[0];
    
    if (!currentUser) {
      return res.status(404).json({ error: 'Usuário atual não encontrado' });
    }
    
    res.json(currentUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter usuário atual' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, name, bio, avatar } = req.body;
    
    if (!username || !name) {
      return res.status(400).json({ error: 'Nome de usuário e nome são obrigatórios' });
    }
    
    const users = await readData(USERS_FILE);
    
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ error: 'Nome de usuário já existe' });
    }
    
    const newUser = {
      id: generateId('user'),
      username,
      name,
      bio: bio || '',
      avatar: avatar || '',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const success = await writeData(USERS_FILE, users);
    if (!success) {
      return res.status(500).json({ error: 'Erro ao salvar usuário' });
    }
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.params.id;
    
    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (name) users[userIndex].name = name;
    if (bio !== undefined) users[userIndex].bio = bio;
    if (avatar !== undefined) users[userIndex].avatar = avatar;
    
    const success = await writeData(USERS_FILE, users);
    if (!success) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
    
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const users = await readData(USERS_FILE);
    const updatedUsers = users.filter(user => user.id !== userId);
    
    if (users.length === updatedUsers.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const success = await writeData(USERS_FILE, updatedUsers);
    if (!success) {
      return res.status(500).json({ error: 'Erro ao remover usuário' });
    }
    
    res.json({ success: true, message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser
};
