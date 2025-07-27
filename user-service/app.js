// user-service/app.js
const express = require('express');
const app = express();

app.use(express.json());

const users = [];

app.post('/users/register', (req, res) => {
  const { username, email } = req.body;
  const user = { id: users.length + 1, username, email };
  users.push(user);
  res.status(201).json(user);
});

app.post('/users/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ message: 'Login success', user });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: "User not found" });
});

module.exports = app;
