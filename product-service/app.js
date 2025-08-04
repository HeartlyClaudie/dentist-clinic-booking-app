const express = require('express');
const app = express();
const logger = require('./logger');
const sequelize = require('./sequelize');
const Product = require('./models/product');

app.use(express.json());

// Function to seed initial product
const seedInitialProduct = async () => {
  const existing = await Product.findOne({ where: { name: 'toothpaste' } });
  if (!existing) {
    await Product.create({
      name: 'toothpaste',
      price: 25,
      stock: 10
    });
    logger.info('✅ Seeded initial product: Toothpaste');
  } else {
    logger.info('ℹ️ Product "toothpaste" already exists, skipping seeding.');
  }
};

// Sync the model with the database
sequelize.sync({ force: false })
  .then(async () => {
    logger.info('PostgreSQL connected and Product model synced');
    await seedInitialProduct(); // 🌱 call seeder here
  })
  .catch(err => {
    logger.error('Sequelize sync error: ' + err.message);
  });

// POST /products – Add a new dental service
app.post('/products', async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || stock === undefined) {
    logger.warn("Missing fields when adding product.");
    return res.status(400).json({ message: 'name, price, and stock are required' });
  }

  try {
    const existing = await Product.findOne({ where: { name: name.trim().toLowerCase() } });
    if (existing) {
      logger.warn(`Duplicate product: ${name}`);
      return res.status(409).json({ message: 'Service already exists' });
    }

    const newProduct = await Product.create({
      name: name.trim().toLowerCase(),
      price,
      stock
    });

    logger.info(`Product added: ${newProduct.name} (ID: ${newProduct.id})`);
    res.status(201).json(newProduct);
  } catch (err) {
    logger.error(`Product creation failed: ${err.message}`);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// GET /products – List all available services
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'price', 'stock']
    });

    logger.info(`Returned ${products.length} products`);
    res.json(products);
  } catch (err) {
    logger.error(`Failed to fetch products: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = app;
