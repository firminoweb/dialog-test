
const generateId = (prefix = '', length = 8) => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 2 + length);
    
  return prefix ? `${prefix}_${timestamp}_${randomPart}` : `${timestamp}_${randomPart}`;
};
  
const idExists = (collection, id) => {
  return collection.some(item => item.id === id);
};
  

const generateUniqueId = (collection, prefix = '') => {
  let id = generateId(prefix);

  while (idExists(collection, id)) {
    id = generateId(prefix);
  }
  
  return id;
};
  
module.exports = {
  generateId,
  idExists,
  generateUniqueId
};
