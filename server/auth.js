// Simple in-memory user store
const users = [];
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  // For simplicity, just return success (no JWT/session yet)
  res.json({ message: 'Login successful.', username });
});

module.exports = router;
