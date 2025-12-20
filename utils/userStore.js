// In-memory user store for connected chat users
const users = new Map();

/**
 * Add a user to the store
 * @param {string} socketId - Socket.IO socket ID
 * @param {object} userData - User data {username, key}
 */
const addUser = (socketId, userData) => {
  users.set(socketId, userData);
};

/**
 * Get a user from the store
 * @param {string} socketId - Socket.IO socket ID
 * @returns {object|undefined} User data or undefined
 */
const getUser = (socketId) => {
  return users.get(socketId);
};

/**
 * Remove a user from the store
 * @param {string} socketId - Socket.IO socket ID
 * @returns {boolean} True if user was removed
 */
const removeUser = (socketId) => {
  return users.delete(socketId);
};

/**
 * Get all users
 * @returns {Map} All users
 */
const getAllUsers = () => {
  return users;
};

module.exports = {
  addUser,
  getUser,
  removeUser,
  getAllUsers
};
