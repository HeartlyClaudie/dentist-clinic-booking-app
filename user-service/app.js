const express = require('express');
const app = express();
const logger = require('./logger'); // Logger
const sequelize = require('./sequelize'); // Sequelize connection
const User = require('./models/user'); // User model

app.use(express.json());

// Sync database
sequelize.sync()
  .then(() => {
    logger.info("Database synced.");
  })
  .catch((err) => {
    logger.error(`Database sync error: ${err.message}`);
  });

// Register user
app.post('/users/register', async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    logger.warn("Registration failed: Missing username or email.");
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    const newUser = await User.create({ username, email });
    logger.info(`New user registered: ${username} (ID: ${newUser.id})`);
    res.status(201).json(newUser);
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
app.post('/users/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    logger.warn("Login failed: Missing email.");
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      logger.info(`Login success for user ID: ${user.id}`);
      res.json({ message: 'Login success', user });
    } else {
      logger.warn(`Login failed for email: ${email}`);
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (user) {
      logger.info(`Fetched user ID: ${user.id}`);
      res.json(user);
    } else {
      logger.warn(`User not found with ID: ${id}`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    logger.error(`Fetch error for ID ${id}: ${err.message}`);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = app;
