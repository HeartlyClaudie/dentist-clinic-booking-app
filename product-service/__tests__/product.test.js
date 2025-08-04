const request = require('supertest');
const express = require('express');
const logger = require('../logger');
const { Sequelize, DataTypes } = require('sequelize');

// In-memory SQLite DB for isolated test environment
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// Define Product model (updated)
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

// Test app setup
const app = express();
app.use(express.json());

// POST /products
app.post('/products', async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'name, price, and stock are required' });
  }

  try {
    const existing = await Product.findOne({ where: { name: name.trim().toLowerCase() } });
    if (existing) {
      return res.status(409).json({ message: 'Service already exists' });
    }

    const product = await Product.create({
      name: name.trim().toLowerCase(),
      price,
      stock
    });

    logger.info(`Added: ${product.name}`);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /products
app.get('/products', async (_req, res) => {
  const products = await Product.findAll({
    attributes: ['id', 'name', 'price', 'stock']
  });
  res.json(products);
});

// Lifecycle hooks
beforeAll(async () => {
  await sequelize.sync();
});

afterEach(async () => {
  await Product.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

// Tests
describe('Product Service', () => {

  test('should add a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'Cleaning',
        price: 80,
        stock: 10
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'cleaning'); // normalized
    expect(res.body).toHaveProperty('price', 80);
    expect(res.body).toHaveProperty('stock', 10);
  });

  test('should reject duplicate product names', async () => {
    await Product.create({ name: 'cleaning', price: 80, stock: 10 });

    const res = await request(app)
      .post('/products')
      .send({
        name: 'Cleaning',
        price: 100,
        stock: 5
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Service already exists');
  });

  test('should return all products', async () => {
    await Product.create({
      name: 'filling',
      price: 150,
      stock: 5
    });

    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('name', 'filling');
  });

  test('should reject if required fields are missing', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Checkup' }); // missing price & stock

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });
});
