const express = require('express');
const bcrypt = require('bcrypt');
const logger = require('./logger');
const sequelize = require('./sequelize');
const User = require('./models/user');

const app = express();
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
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    logger.warn("Registration failed: Missing fields.");
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    logger.info(`New user registered: ${username} (ID: ${newUser.id})`);
    res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Login failed: Missing email or password.");
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`Login failed: Email not found - ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.warn(`Login failed: Invalid password for user ID ${user.id}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    logger.info(`Login success for user ID: ${user.id}`);
    res.json({ message: 'Login success', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email'] // Hide password
    });

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
