const express = require('express');
const app = express();
const logger = require('./logger');
const sequelize = require('./sequelize');
const Product = require('./models/product');

app.use(express.json());

// Sync the model with the database (create table if it doesn't exist)
sequelize.sync({ force: false }).then(() => {
  console.log('PostgreSQL connected and Product model synced');
}).catch(err => {
  console.error('Sequelize sync error:', err);
});

// Add a new product
app.post('/products', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = await Product.create({ name, price, stock });
    logger.info(`New product added: ${name} (ID: ${product.id})`);
    res.status(201).json(product);
  } catch (err) {
    logger.error(`Product creation failed: ${err.message}`);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const allProducts = await Product.findAll();
    logger.info(`Fetched all products. Count: ${allProducts.length}`);
    res.json(allProducts);
  } catch (err) {
    logger.error(`Failed to fetch products: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = app;
