// api-node/utils/dataHandler.js
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

/**
 * Lê dados de um arquivo JSON
 * @param {string} fileName - Nome do arquivo JSON
 * @returns {Promise<Array>} - Array com os dados do arquivo
 */
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

/**
 * Escreve dados em um arquivo JSON
 * @param {string} fileName - Nome do arquivo JSON
 * @param {Array} data - Dados a serem escritos
 * @returns {Promise<boolean>} - Verdadeiro se sucesso, falso se erro
 */
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

/**
 * Gera um ID único
 * @param {string} prefix - Prefixo para o ID (opcional)
 * @returns {string} - ID único
 */
const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

module.exports = {
  readData,
  writeData,
  generateId
};
