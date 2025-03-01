const fs = require('fs').promises;
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');

const readData = async (fileName) => {
  try {
    const filePath = path.join(dataDir, fileName);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler ${fileName}:`, error);
    return [];
  }
};

const writeData = async (fileName, data) => {
  try {
    const filePath = path.join(dataDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao escrever ${fileName}:`, error);
    return false;
  }
};

const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

module.exports = {
  readData,
  writeData,
  generateId
};
