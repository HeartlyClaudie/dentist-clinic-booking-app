const express = require('express');
const app = express();
const logger = require('./logger'); // Import logger

app.use(express.json());

// In-memory products
const products = [];

// Add a new product
app.post('/products', (req, res) => {
  const { name, description, price } = req.body;
  const product = {
    id: products.length + 1,
    name,
    description,
    price
  };
  products.push(product);

  logger.info(`New product added: ${name} (ID: ${product.id})`);

  res.status(201).json(product);
});

// Get all products
app.get('/products', (req, res) => {
  logger.info("GET /products called");
  res.json(products);
});

module.exports = app;
