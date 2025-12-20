# Quantum Chat Backend

WebSocket backend server for a quantum-secure chat application. This server acts as a proxy layer between the frontend chat interface and a Python encryption service, while managing real-time WebSocket connections.

## Architecture

```
quantum-backend/
├── config/
│   └── index.js                 # Environment configuration
├── routes/
│   └── encryption.routes.js     # API proxy routes
├── sockets/
│   └── chat.handlers.js         # WebSocket handlers
├── middleware/
│   └── errorHandler.js          # Error handling
├── utils/
│   └── userStore.js             # User state management
├── server.js                    # Application entry point
├── .env                         # Environment variables
└── package.json
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** (optional)

   The `.env` file contains default configuration. Modify if needed:
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   PYTHON_SERVICE_URL=http://localhost:5001
   NODE_ENV=development
   ```

3. **Start the server**

   Production mode:
   ```bash
   npm start
   # or
   node server.js
   ```

   Development mode (with auto-reload):
   ```bash
   npm run dev
   # or
   nodemon server.js
   ```

## API Endpoints

### Encryption Proxy Routes
- `POST /api/encrypt` - Forwards encryption request to Python service
- `POST /api/decrypt` - Forwards decryption request to Python service

### WebSocket Events

**Client → Server:**
- `join` - User joins chat with `{username, key}`
- `send-message` - Send message with `{text, encrypted, encryptedHex}`
- `disconnect` - User disconnects

**Server → Client:**
- `joined` - Confirmation of successful join
- `user-joined` - Notify when another user joins
- `user-left` - Notify when user leaves
- `new-message` - Broadcast new message to all users

## Dependencies

The application requires a Python encryption service running on port 5001 (configurable via `PYTHON_SERVICE_URL`).

### Three-Tier Architecture
1. **Frontend** (port 3000) - Chat UI
2. **Node.js Backend** (port 3001) - This server
3. **Python Service** (port 5001) - Quantum encryption/decryption

## Development

The codebase is organized by responsibility:
- **config/** - Environment configuration
- **routes/** - Express routes (API endpoints)
- **sockets/** - Socket.IO event handlers
- **middleware/** - Express middleware (error handling)
- **utils/** - Utility functions (user store)

All user state is stored in-memory and is lost on server restart.
