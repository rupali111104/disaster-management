// Basic Express server setup for backend
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const messagesRoutes = require('./messages');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api/messages', messagesRoutes);

app.get('/', (req, res) => {
  res.send('Disaster Management Backend Running');
});

// For Socket.IO message persistence
const MESSAGES_FILE = path.join(__dirname, 'messages.json');
function readMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // Send persisted messages to the new client
  socket.emit('chat history', readMessages());
  socket.on('chat message', (msg) => {
    // Broadcast the full message object (with user, time, text, image)
    io.emit('chat message', msg);
    // Save to file
    const messages = readMessages();
    messages.push(msg);
    writeMessages(messages);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
