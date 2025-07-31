const request = require('supertest');
const express = require('express');
const logger = require('../logger');
const { Sequelize, DataTypes } = require('sequelize');

// In-memory SQLite DB for isolated test environment
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// Define Product model locally for testing
const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  price: DataTypes.FLOAT,
}, {
  timestamps: false
});

// Create a test version of the app
const app = express();
app.use(express.json());

// Add product route
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    logger.info(`Added: ${product.name}`);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products route
app.get('/products', async (_req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// Sync DB before all tests
beforeAll(async () => {
  await sequelize.sync();
});

// Clean DB after each test
afterEach(async () => {
  await Product.destroy({ where: {} });
});

// Close DB after all tests
afterAll(async () => {
  await sequelize.close();
});

// Tests
describe('Product Service', () => {
  test('should add a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'Toothbrush',
        description: 'Electric toothbrush with soft bristles',
        price: 29.99
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Toothbrush');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('price', 29.99);
  });

  test('should return all products', async () => {
    await Product.create({
      name: 'Toothpaste',
      description: 'Mint flavored',
      price: 3.49
    });

    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('name', 'Toothpaste');
  });
});
