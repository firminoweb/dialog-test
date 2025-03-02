const fs = require('fs').promises;
const path = require('path');
const idGenerator = require('./idGenerator');
const dataDir = path.join(__dirname, '..', 'data');

const ensureDataDirExists = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    return true;
  } catch (error) {
    console.error('Erro ao criar diretório de dados:', error);
    return false;
  }
};

const readData = async (fileName) => {
  try {
    await ensureDataDirExists();
    
    const filePath = path.join(dataDir, fileName);
    console.log(`Lendo arquivo ${filePath}`);
    
    try {
      await fs.access(filePath);
    } catch (error) {

      console.log(`Arquivo ${fileName} não encontrado, criando novo`);
      await fs.writeFile(filePath, '[]');
      return [];
    }
    
    const data = await fs.readFile(filePath, 'utf8');
    if (!data || data.trim() === '') {
      console.log(`Arquivo ${fileName} vazio, retornando array vazio`);
      return [];
    }
    
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`Erro ao fazer parse de ${fileName}:`, parseError);

      await fs.writeFile(filePath, '[]');
      return [];
    }
  } catch (error) {
    console.error(`Erro ao ler ${fileName}:`, error);
    return [];
  }
};

const writeData = async (fileName, data) => {
  try {
    await ensureDataDirExists();
    
    const filePath = path.join(dataDir, fileName);
    console.log(`Escrevendo em ${filePath}, ${data.length} itens`);
    
    const jsonData = JSON.stringify(data, null, 2);

    try {
      await fs.access(filePath);
    } catch (error) {}
    
    await fs.writeFile(filePath, jsonData);
    console.log(`Arquivo ${fileName} salvo com sucesso`);
    return true;
  } catch (error) {
    console.error(`Erro ao escrever ${fileName}:`, error);
    return false;
  }
};

module.exports = {
  readData,
  writeData,
  generateId: idGenerator.generateId,
  generateUniqueId: idGenerator.generateUniqueId
};
