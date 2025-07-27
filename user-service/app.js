const express = require('express');
const app = express();
const logger = require('./logger'); // Import logger

app.use(express.json());

const users = [];

// Register
app.post('/users/register', (req, res) => {
  const { username, email } = req.body;
  const user = { id: users.length + 1, username, email };
  users.push(user);

  logger.info(`New user registered: ${username} (ID: ${user.id})`);

  res.status(201).json(user);
});

// Login
app.post('/users/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    logger.info(`Login success for user ID: ${user.id}`);
    res.json({ message: 'Login success', user });
  } else {
    logger.warn(`Login failed for email: ${email}`);
    res.status(401).json({ message: 'Login failed' });
  }
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    logger.info(`Fetched user ID: ${user.id}`);
    res.json(user);
  } else {
    logger.warn(`User not found with ID: ${req.params.id}`);
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = app;
