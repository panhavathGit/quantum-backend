const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const users = new Map();

// Proxy to Python service
app.post('/api/encrypt', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/api/encrypt', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Encryption service error' });
  }
});

app.post('/api/decrypt', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/api/decrypt', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Decryption service error' });
  }
});

// WebSocket chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', ({ username, key }) => {
    users.set(socket.id, { username, key });
    
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
  
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
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
  
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.username} disconnected`);
      users.delete(socket.id);
      
      io.emit('user-left', {
        username: user.username,
        timestamp: new Date()
      });
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Chat server: http://localhost:${PORT}`);
  console.log(`🔗 WebSocket: ws://localhost:${PORT}`);
});