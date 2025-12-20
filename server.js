const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const config = require('./config');
const encryptionRoutes = require('./routes/encryption.routes');
const setupChatHandlers = require('./sockets/chat.handlers');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', encryptionRoutes);

// Error handling (must be last)
app.use(errorHandler);

// Setup WebSocket handlers
setupChatHandlers(io);

// Start server
server.listen(config.PORT, () => {
  console.log(`🚀 Chat server: http://localhost:${config.PORT}`);
  console.log(`🔗 WebSocket: ws://localhost:${config.PORT}`);
  console.log(`🌍 Frontend: ${config.FRONTEND_URL}`);
  console.log(`🔐 Python service: ${config.PYTHON_SERVICE_URL}`);
});
