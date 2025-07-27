// app.js
const express = require('express');
const app = express();

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
  res.status(201).json(product);
});

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

module.exports = app;
