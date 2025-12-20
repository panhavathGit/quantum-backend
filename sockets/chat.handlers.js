const { addUser, getUser, removeUser } = require('../utils/userStore');

/**
 * Setup Socket.IO event handlers for chat functionality
 * @param {object} io - Socket.IO server instance
 */
const setupChatHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining chat
    socket.on('join', ({ username, key }) => {
      addUser(socket.id, { username, key });

      socket.emit('joined', {
        username,
        hasKey: !!key,
        keyPreview: key ? key.substring(0, 16) + '...' : 'None'
      });

      // Notify others
      socket.broadcast.emit('user-joined', {
        username,
        timestamp: new Date()
      });

      console.log(`${username} joined with key: ${key ? 'Yes' : 'No'}`);
    });

    // Handle message sending
    socket.on('send-message', (data) => {
      const user = getUser(socket.id);
      if (!user) return;

      const message = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        userId: socket.id,
        username: user.username,
        text: data.text,
        encrypted: data.encrypted || false,
        encryptedHex: data.encryptedHex,
        timestamp: new Date()
      };

      // Broadcast to all
      io.emit('new-message', message);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      const user = getUser(socket.id);
      if (user) {
        console.log(`${user.username} disconnected`);
        removeUser(socket.id);

        io.emit('user-left', {
          username: user.username,
          timestamp: new Date()
        });
      }
    });
  });
};

module.exports = setupChatHandlers;
