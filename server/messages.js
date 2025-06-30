const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Helper to read messages from file
function readMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write messages to file
function writeMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// Get all messages
router.get('/', (req, res) => {
  res.json(readMessages());
});

// Add a new message
router.post('/', (req, res) => {
  const messages = readMessages();
  messages.push(req.body);
  writeMessages(messages);
  res.status(201).json({ message: 'Message saved.' });
});

module.exports = router;
